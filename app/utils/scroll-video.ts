/**
 * Controla um <video> pausado a partir do scroll: a posição da página dentro
 * da seção vira o `currentTime` do vídeo. Também publica o progresso (0–1)
 * na variável CSS `--hero-progress` da seção, usada para revelar o conteúdo
 * sem re-renderizar o Vue a cada quadro.
 *
 * O progresso é suavizado (inércia exponencial), então tanto o vídeo quanto
 * o conteúdo seguem a rolagem sem saltos, mesmo com rodas de mouse em degraus.
 */

export interface ScrollVideoElements {
  section: HTMLElement
  sticky: HTMLElement
  video: HTMLVideoElement
  poster: HTMLImageElement
}

export interface ScrollVideoOptions {
  src: string
  /** Versão leve para telas até `smallMax` px de largura. */
  srcSmall?: string
  smallMax?: number
  /** Taxa de quadros do arquivo (evita seeks redundantes). */
  fps?: number
  poster?: string
  /** Imagem estática para erro de carregamento / movimento reduzido. */
  fallback?: string
  /** blob: baixa o arquivo inteiro antes do scrub (seeks locais, mais fluido). */
  load?: 'blob' | 'stream'
  /**
   * Tempo máximo (ms) esperando o download completo no modo blob. Passou
   * disso (conexão lenta), cai para streaming: o hero anima logo, só um
   * pouco menos fluido no começo, em vez de ficar parado no pôster.
   */
  blobTimeoutMs?: number
  /** Fração do vídeo exibida ao fim do scroll (0–1). Ex.: 0.9 para antes dos últimos 10%. */
  endAt?: number
  /** Constante de tempo da suavização, em ms. Maior = mais lento e macio. */
  smoothingMs?: number
  onProgress?: (progress: number) => void
}

/** Converte um tempo para o centro do quadro correspondente (evita a fronteira entre dois quadros). */
export function snapToFrame(time: number, duration: number, fps: number): number {
  const last = Math.max(0, Math.round(duration * fps) - 1)
  const frame = Math.min(last, Math.max(0, Math.floor(time * fps)))
  return Math.min((frame + 0.5) / fps, duration - 0.001)
}

/** Progresso da rolagem dentro da seção: 0 no topo, 1 quando o sticky está prestes a soltar. */
export function scrollProgress(sectionTop: number, scrollable: number): number {
  const p = -sectionTop / Math.max(1, scrollable)
  return p < 0 ? 0 : p > 1 ? 1 : p
}

/**
 * Baixa o arquivo inteiro como Blob, desistindo após `timeoutMs`. Rejeita
 * com AbortError se `signal` abortar (teardown) e com TimeoutError se o
 * prazo estourar — o chamador decide o que fazer em cada caso.
 */
export async function fetchBlobWithin(url: string, timeoutMs: number, signal: AbortSignal): Promise<Blob> {
  const controller = new AbortController()
  const onAbort = () => controller.abort(abortError())
  if (signal.aborted) throw abortError()
  signal.addEventListener('abort', onAbort, { once: true })
  const timer = setTimeout(() => controller.abort(new DOMException('Timeout', 'TimeoutError')), timeoutMs)
  try {
    // O sinal cobre também a leitura do corpo (res.blob()), não só a resposta.
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.blob()
  }
  catch (err) {
    throw controller.signal.aborted ? controller.signal.reason : err
  }
  finally {
    clearTimeout(timer)
    signal.removeEventListener('abort', onAbort)
  }
}

function abortError() {
  return new DOMException('Aborted', 'AbortError')
}

export class ScrollVideoController {
  private readonly el: ScrollVideoElements
  private readonly opts: Required<Omit<ScrollVideoOptions, 'srcSmall' | 'poster' | 'fallback' | 'onProgress'>>
    & Pick<ScrollVideoOptions, 'srcSmall' | 'poster' | 'fallback' | 'onProgress'>

  private duration = 0
  private ready = false
  private appliedTime = -1
  private seekInFlight = false
  private rafId = 0
  private lastFrame = 0
  private scrollable = 1
  private current = -1 // progresso suavizado; -1 = ainda não posicionado
  private isStatic = false
  private objectUrl: string | null = null
  private abort = new AbortController()
  private generation = 0 // incrementado a cada teardown: fluxos assíncronos antigos se descartam
  private destroyed = false
  private resizeObserver: ResizeObserver | null = null
  private readonly motionQuery: MediaQueryList

  constructor(elements: ScrollVideoElements, options: ScrollVideoOptions) {
    this.el = elements
    this.opts = { smallMax: 900, fps: 24, load: 'blob', blobTimeoutMs: 4000, endAt: 1, smoothingMs: 140, ...options }

    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.motionQuery.addEventListener('change', this.onMotionChange)

    if (this.motionQuery.matches) this.enterStatic()
    else this.start()
  }

  destroy() {
    this.destroyed = true
    this.teardownVideoMode()
    this.motionQuery.removeEventListener('change', this.onMotionChange)
  }

  /** Rola até o fim do trecho animado (conteúdo totalmente visível). */
  scrollToEnd() {
    if (this.isStatic) return
    const top = window.scrollY + this.el.section.getBoundingClientRect().top + this.scrollable
    window.scrollTo({ top, behavior: 'smooth' })
  }

  /* ---------- ciclo de vida ---------- */

  private start() {
    this.isStatic = false
    this.el.section.classList.remove('is-static', 'is-fallback')
    if (this.opts.poster) this.el.poster.src = this.opts.poster

    const v = this.el.video
    v.muted = true
    v.defaultMuted = true
    v.playsInline = true
    v.pause()
    v.addEventListener('seeked', this.onSeeked)
    v.addEventListener('error', this.onError)

    window.addEventListener('scroll', this.requestTick, { passive: true })
    this.resizeObserver = new ResizeObserver(this.measure)
    this.resizeObserver.observe(this.el.section)
    this.resizeObserver.observe(this.el.sticky)
    this.current = -1
    this.measure()

    void this.loadVideo()
  }

  private async loadVideo() {
    const { src, srcSmall, smallMax, load, blobTimeoutMs } = this.opts
    const url = srcSmall && window.innerWidth <= smallMax ? srcSmall : src
    const v = this.el.video
    const gen = this.generation
    const { signal } = this.abort
    const stale = () => this.destroyed || gen !== this.generation

    try {
      let finalUrl = url
      if (load === 'blob') {
        try {
          const blob = await fetchBlobWithin(url, blobTimeoutMs, signal)
          if (stale()) return
          this.objectUrl = URL.createObjectURL(blob)
          finalUrl = this.objectUrl
        }
        catch (err) {
          if ((err as Error).name === 'AbortError') return
          finalUrl = url // lento demais, fetch indisponível ou erro → streaming normal
        }
      }
      if (stale()) return

      v.preload = 'auto'
      v.src = finalUrl

      await this.waitFor('loadedmetadata', () => v.readyState >= 1, signal)
      if (stale()) return
      this.duration = v.duration

      // iOS Safari só pinta quadros após um play(); play/pause mudo uma única vez.
      if (v.readyState < 2) {
        try {
          await v.play()
        }
        catch { /* bloqueado → seek ainda funciona na maioria dos casos */ }
        if (stale()) return
        v.pause()
      }

      await this.waitFor('loadeddata', () => v.readyState >= 2, signal)
      if (stale()) return
    }
    catch {
      return // abortado (teardown) ou erro de mídia — este é tratado por onError
    }

    this.ready = true
    this.appliedTime = -1
    v.addEventListener('seeked', () => this.el.section.classList.add('is-ready'), { once: true, signal })
    this.applySeek()
  }

  /** Resolve no evento (ou se já satisfeito); rejeita em erro do vídeo ou abort. */
  private waitFor(event: string, isDone: () => boolean, signal: AbortSignal) {
    const v = this.el.video
    return new Promise<void>((resolve, reject) => {
      if (signal.aborted) return reject(abortError())
      if (isDone()) return resolve()
      v.addEventListener(event, () => resolve(), { once: true, signal })
      v.addEventListener('error', () => reject(v.error), { once: true, signal })
      signal.addEventListener('abort', () => reject(abortError()), { once: true })
    })
  }

  private teardownVideoMode() {
    cancelAnimationFrame(this.rafId)
    this.rafId = 0
    window.removeEventListener('scroll', this.requestTick)
    this.resizeObserver?.disconnect()
    this.resizeObserver = null

    const v = this.el.video
    v.removeEventListener('seeked', this.onSeeked)
    v.removeEventListener('error', this.onError)
    this.generation++
    this.abort.abort()
    this.abort = new AbortController()
    if (v.hasAttribute('src')) {
      v.preload = 'none'
      v.removeAttribute('src')
      v.load()
    }
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl)
      this.objectUrl = null
    }
    this.el.section.classList.remove('is-ready')
    this.ready = false
    this.seekInFlight = false
    this.duration = 0
  }

  /* ---------- movimento reduzido / falha ---------- */

  private enterStatic() {
    this.teardownVideoMode()
    this.isStatic = true
    this.el.section.classList.add('is-static')
    if (this.opts.fallback) this.el.poster.src = this.opts.fallback
    this.publish(1)
  }

  private onMotionChange = (e: MediaQueryListEvent) => {
    if (this.destroyed) return
    if (e.matches) this.enterStatic()
    else this.start()
  }

  private onError = () => {
    // Mantém o trecho de scroll (layout estável) e o conteúdo, mas exibe a imagem estática.
    this.ready = false
    this.el.section.classList.add('is-fallback')
    if (this.opts.fallback) this.el.poster.src = this.opts.fallback
  }

  /* ---------- medição e progresso ---------- */

  private measure = () => {
    this.scrollable = Math.max(1, this.el.section.offsetHeight - this.el.sticky.offsetHeight)
    this.requestTick()
  }

  private requestTick = () => {
    if (this.rafId) return
    this.lastFrame = 0
    this.rafId = requestAnimationFrame(this.tick)
  }

  private tick = (now: number) => {
    this.rafId = 0
    const target = scrollProgress(this.el.section.getBoundingClientRect().top, this.scrollable)

    if (this.current < 0) {
      this.current = target // primeira medição: posiciona direto, sem animar
    }
    else {
      const dt = this.lastFrame ? Math.min(64, now - this.lastFrame) : 16
      const k = 1 - Math.exp(-dt / this.opts.smoothingMs)
      this.current += (target - this.current) * k
      if (Math.abs(target - this.current) < 0.0005) this.current = target
    }
    this.publish(this.current)

    if (this.current !== target) {
      this.rafId = requestAnimationFrame(this.tick)
      this.lastFrame = now
    }
    this.applySeek()
  }

  private publish(progress: number) {
    this.el.section.style.setProperty('--hero-progress', progress.toFixed(4))
    this.opts.onProgress?.(progress)
  }

  private applySeek() {
    if (!this.ready || !this.duration || this.seekInFlight) return // 'seeked' busca o alvo mais recente
    const end = this.duration * Math.min(1, Math.max(0, this.opts.endAt))
    const t = snapToFrame(Math.max(0, this.current) * end, this.duration, this.opts.fps)
    if (Math.abs(t - this.appliedTime) < 1e-4) return
    this.appliedTime = t
    this.seekInFlight = true
    this.el.video.currentTime = t
  }

  private onSeeked = () => {
    this.seekInFlight = false
    if (!this.el.video.paused) this.el.video.pause()
    this.applySeek()
  }
}
