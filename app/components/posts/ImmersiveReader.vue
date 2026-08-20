<script setup lang="ts">
import { PanelRightOpenIcon, PauseIcon, PlayIcon, XIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { extractReadableBlocks, renderMarkdown, splitSentences } from '@/utils/markdown'

const props = defineProps<{
  title: string
  content: string
}>()

const open = defineModel<boolean>('open', { default: false })

type TextSize = 'small' | 'medium' | 'large'
type Theme = 'light' | 'dark'
type FocusMode = 'none' | 'line'
type VoiceGender = 'female' | 'male'

interface ReaderSettings {
  textSize: TextSize
  theme: Theme
  focusMode: FocusMode
  voiceGender: VoiceGender
  speed: number
}

const DEFAULT_SETTINGS: ReaderSettings = {
  textSize: 'large',
  theme: 'light',
  focusMode: 'none',
  voiceGender: 'female',
  speed: 1.5
}

const STORAGE_KEY = 'portfolio-cms:immersive-reader-settings'

const textSize = ref<TextSize>(DEFAULT_SETTINGS.textSize)
const theme = ref<Theme>(DEFAULT_SETTINGS.theme)
const focusMode = ref<FocusMode>(DEFAULT_SETTINGS.focusMode)
const voiceGender = ref<VoiceGender>(DEFAULT_SETTINGS.voiceGender)
const speed = ref(DEFAULT_SETTINGS.speed)

const sidebarOpen = ref(false)
const isPlaying = ref(false)
const currentChunkIndex = ref(-1)
const contentRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)

// Janela da máscara: posição/altura exatas da frase em foco (não um
// tamanho fixo) — assim ela sempre mostra exatamente o texto sendo lido
// naquele momento, nem mais nem menos, do tamanho real que ele ocupa
// (uma frase pode quebrar em mais de uma linha visual).
const maskWindowTop = ref(0)
const maskWindowHeight = ref(0)
let maskUpdateRaf: number | null = null

function updateMaskWindow() {
  if (focusMode.value !== 'line' || currentChunkIndex.value < 0 || !contentRef.value || !wrapperRef.value) return
  const el = contentRef.value.querySelector(`[data-chunk="${currentChunkIndex.value}"]`)
  if (!el) return
  const wrapperRect = wrapperRef.value.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  maskWindowTop.value = elRect.top - wrapperRect.top
  maskWindowHeight.value = elRect.height
}

// O scroll suave até a frase em foco leva um tempinho pra terminar — em
// vez de medir só uma vez (pegaria a posição errada, no meio da
// animação), a máscara acompanha cada passo do scroll em tempo real.
function scheduleMaskUpdate() {
  if (maskUpdateRaf !== null) return
  maskUpdateRaf = requestAnimationFrame(() => {
    maskUpdateRaf = null
    updateMaskWindow()
  })
}

const textSizeClasses: Record<TextSize, string> = {
  small: 'text-lg',
  medium: 'text-2xl',
  large: 'text-6xl'
}

// Configurações ficam salvas no navegador — reabrir o leitor (mesmo em
// outro post) mantém as preferências do usuário.
function loadSettings() {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const saved = JSON.parse(raw) as Partial<ReaderSettings>
    if (saved.textSize) textSize.value = saved.textSize
    if (saved.theme) theme.value = saved.theme
    if (saved.focusMode) focusMode.value = saved.focusMode
    if (saved.voiceGender) voiceGender.value = saved.voiceGender
    if (typeof saved.speed === 'number') speed.value = saved.speed
  } catch {
    // configuração salva corrompida — segue com os padrões, sem travar o leitor.
  }
}

function persistSettings() {
  if (typeof window === 'undefined') return
  const settings: ReaderSettings = {
    textSize: textSize.value,
    theme: theme.value,
    focusMode: focusMode.value,
    voiceGender: voiceGender.value,
    speed: speed.value
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

watch([textSize, theme, focusMode, voiceGender, speed], persistSettings)

const blocks = computed(() => extractReadableBlocks(renderMarkdown(props.content)))
const blockSentences = computed(() => blocks.value.map(splitSentences))

interface Chunk {
  blockIndex: number
  sentenceIndex: number
  text: string
}

const chunks = computed<Chunk[]>(() => {
  const result: Chunk[] = []
  blockSentences.value.forEach((sentences, blockIndex) => {
    sentences.forEach((text, sentenceIndex) => result.push({ blockIndex, sentenceIndex, text }))
  })
  return result
})

// A API Web Speech não expõe gênero da voz — heurística por nome comum,
// best-effort (varia por navegador/SO). Sem voz reconhecida, o botão fica
// desabilitado em vez de mentir sobre qual voz será usada.
const FEMALE_HINTS = ['female', 'feminina', 'luciana', 'joana', 'samantha', 'victoria', 'karen', 'zira', 'fiona', 'moira', 'tessa']
const MALE_HINTS = ['male', 'masculina', 'felipe', 'daniel', 'fred', 'diego', 'thomas', 'george', 'jorge', 'ricardo']

function classifyVoice(voice: SpeechSynthesisVoice): 'female' | 'male' | null {
  const name = voice.name.toLowerCase()
  if (FEMALE_HINTS.some(hint => name.includes(hint))) return 'female'
  if (MALE_HINTS.some(hint => name.includes(hint))) return 'male'
  return null
}

const voices = ref<SpeechSynthesisVoice[]>([])

function loadVoices() {
  voices.value = window.speechSynthesis.getVoices()
}

const ptVoices = computed(() => {
  const pt = voices.value.filter(v => v.lang.toLowerCase().startsWith('pt'))
  return pt.length ? pt : voices.value
})

const femaleVoice = computed(() => ptVoices.value.find(v => classifyVoice(v) === 'female') ?? null)
const maleVoice = computed(() => ptVoices.value.find(v => classifyVoice(v) === 'male') ?? null)
const selectedVoice = computed(() => (voiceGender.value === 'female' ? femaleVoice.value : maleVoice.value))

let utterances: SpeechSynthesisUtterance[] = []

function stop() {
  window.speechSynthesis.cancel()
  isPlaying.value = false
  currentChunkIndex.value = -1
}

function playFrom(startIndex: number) {
  window.speechSynthesis.cancel()
  const queue = chunks.value.slice(startIndex)
  if (!queue.length) return

  utterances = queue.map((chunk, offset) => {
    const utterance = new SpeechSynthesisUtterance(chunk.text)
    utterance.lang = 'pt-BR'
    utterance.rate = speed.value
    if (selectedVoice.value) utterance.voice = selectedVoice.value
    utterance.onstart = () => {
      currentChunkIndex.value = startIndex + offset
    }
    if (offset === queue.length - 1) {
      utterance.onend = () => {
        isPlaying.value = false
        currentChunkIndex.value = -1
      }
    }
    return utterance
  })

  utterances.forEach(u => window.speechSynthesis.speak(u))
  isPlaying.value = true
}

function togglePlay() {
  if (isPlaying.value) {
    window.speechSynthesis.pause()
    isPlaying.value = false
    return
  }
  if (window.speechSynthesis.paused && currentChunkIndex.value >= 0) {
    window.speechSynthesis.resume()
    isPlaying.value = true
    return
  }
  playFrom(0)
}

// Muda voz/velocidade em tempo real: reinicia a fala a partir da frase atual.
watch([speed, selectedVoice], () => {
  if (currentChunkIndex.value >= 0) {
    playFrom(currentChunkIndex.value)
  }
})

watch(open, (isOpen) => {
  if (!isOpen) {
    stop()
    sidebarOpen.value = false
  }
})

// A linha em foco acompanha o scroll — some do campo de visão enquanto
// lê e a página rola sozinha atrás dela.
watch(currentChunkIndex, async (index) => {
  if (index < 0) {
    return
  }
  await nextTick()
  contentRef.value?.querySelector(`[data-chunk="${index}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  updateMaskWindow()
})

watch(focusMode, async (mode) => {
  if (mode === 'line') {
    await nextTick()
    updateMaskWindow()
  }
})

function onEscapeKeyDown(event: KeyboardEvent) {
  if (sidebarOpen.value) {
    event.preventDefault()
    sidebarOpen.value = false
  }
}

onMounted(() => {
  loadSettings()
  loadVoices()
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
  contentRef.value?.addEventListener('scroll', scheduleMaskUpdate)
  window.addEventListener('resize', scheduleMaskUpdate)
})

onUnmounted(() => {
  window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  window.speechSynthesis.cancel()
  contentRef.value?.removeEventListener('scroll', scheduleMaskUpdate)
  window.removeEventListener('resize', scheduleMaskUpdate)
  if (maskUpdateRaf !== null) cancelAnimationFrame(maskUpdateRaf)
})

function isActive(blockIndex: number, sentenceIndex: number): boolean {
  if (focusMode.value !== 'line' || currentChunkIndex.value < 0) return false
  const current = chunks.value[currentChunkIndex.value]
  if (!current) return false
  return current.blockIndex === blockIndex && current.sentenceIndex === sentenceIndex
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      :show-close-button="false"
      class="inset-0 top-0 left-0 grid h-screen w-screen max-w-none translate-x-0 translate-y-0 grid-rows-[auto_1fr] gap-0 rounded-none bg-background p-0 text-foreground sm:max-w-none"
      :class="theme === 'dark' ? 'dark' : ''"
      @escape-key-down="onEscapeKeyDown"
    >
      <DialogTitle class="sr-only">
        Leitor imersivo — {{ title }}
      </DialogTitle>

      <header class="flex items-center gap-4 border-b border-current/10 px-6 py-3">
        <DialogClose as-child>
          <Button variant="ghost" size="icon" aria-label="Fechar leitor imersivo">
            <XIcon class="size-5" />
          </Button>
        </DialogClose>

        <span class="flex-1 truncate text-sm font-medium">{{ title }}</span>

        <Button type="button" size="sm" :aria-pressed="isPlaying" @click="togglePlay">
          <PauseIcon v-if="isPlaying" class="size-4" />
          <PlayIcon v-else class="size-4" />
          {{ isPlaying ? 'Pausar' : 'Escutar' }}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          :aria-expanded="sidebarOpen"
          aria-controls="reader-settings-panel"
          :aria-label="sidebarOpen ? 'Fechar configurações do leitor' : 'Abrir configurações do leitor'"
          @click="sidebarOpen = !sidebarOpen"
        >
          <PanelRightOpenIcon class="size-5" />
        </Button>
      </header>

      <div ref="wrapperRef" class="relative grid min-h-0 grid-cols-1">
        <div
          ref="contentRef"
          tabindex="0"
          role="region"
          :aria-label="`Conteúdo do post: ${title}`"
          class="col-start-1 row-start-1 overflow-y-auto px-6 py-10 sm:px-12"
        >
          <div
            class="flex w-full flex-col gap-6 leading-relaxed font-medium text-foreground"
            :class="textSizeClasses[textSize]"
          >
            <p v-for="(sentences, blockIndex) in blockSentences" :key="blockIndex">
              <span
                v-for="(sentence, sentenceIndex) in sentences"
                :key="sentenceIndex"
                :data-chunk="chunks.findIndex(c => c.blockIndex === blockIndex && c.sentenceIndex === sentenceIndex)"
                class="transition-[font-weight] duration-150"
                :class="isActive(blockIndex, sentenceIndex) ? 'font-semibold' : 'font-normal'"
              >{{ sentence + ' ' }}</span>
            </p>
          </div>
        </div>

        <!-- Máscara de leitura: escurece tudo fora da frase em foco — a
             janela é medida e posicionada exatamente sobre ela. -->
        <div
          v-if="focusMode === 'line' && currentChunkIndex >= 0"
          class="pointer-events-none col-start-1 row-start-1"
        >
          <div class="absolute inset-x-0 top-0 bg-reader-mask/95" :style="{ height: `${maskWindowTop}px` }" />
          <div class="absolute inset-x-0 bottom-0 bg-reader-mask/95" :style="{ top: `${maskWindowTop + maskWindowHeight}px` }" />
        </div>

        <Transition
          enter-active-class="transition-transform duration-200"
          enter-from-class="translate-x-full"
          leave-active-class="transition-transform duration-200"
          leave-to-class="translate-x-full"
        >
          <aside
            v-if="sidebarOpen"
            id="reader-settings-panel"
            aria-label="Configurações do leitor imersivo"
            class="col-start-1 row-start-1 ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto border-l border-current/10 bg-background text-foreground shadow-lg"
          >
            <div class="flex items-center justify-between border-b border-current/10 px-4 py-3">
              <h2 class="font-medium">
                Configurações
              </h2>
              <Button variant="ghost" size="icon" aria-label="Fechar configurações do leitor" @click="sidebarOpen = false">
                <XIcon class="size-4" />
              </Button>
            </div>

            <div class="flex flex-col gap-6 px-4 py-4">
              <fieldset class="flex flex-col gap-2">
                <legend class="mb-2 text-sm font-medium">
                  Tamanho do texto
                </legend>
                <label v-for="size in (['small', 'medium', 'large'] as const)" :key="size" class="flex items-center gap-2 text-sm">
                  <input v-model="textSize" type="radio" name="reader-text-size" :value="size">
                  {{ size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Grande' }}
                </label>
              </fieldset>

              <fieldset class="flex flex-col gap-2">
                <legend class="mb-2 text-sm font-medium">
                  Foco de leitura
                </legend>
                <label class="flex items-center gap-2 text-sm">
                  <input v-model="focusMode" type="radio" name="reader-focus-mode" value="none">
                  Sem foco
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <input v-model="focusMode" type="radio" name="reader-focus-mode" value="line">
                  Em linha
                </label>
              </fieldset>

              <fieldset class="flex flex-col gap-3">
                <legend class="mb-1 text-sm font-medium">
                  Voz
                </legend>
                <label class="flex items-center gap-2 text-sm">
                  <input v-model="voiceGender" type="radio" name="reader-voice-gender" value="female" :disabled="!femaleVoice">
                  Feminina
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <input v-model="voiceGender" type="radio" name="reader-voice-gender" value="male" :disabled="!maleVoice">
                  Masculina
                </label>

                <div class="mt-2 flex flex-col gap-1">
                  <label for="reader-speed" class="text-sm">Velocidade ({{ speed }}x)</label>
                  <input id="reader-speed" v-model.number="speed" type="range" min="0.5" max="2" step="0.25">
                </div>
              </fieldset>

              <fieldset class="flex flex-col gap-2">
                <legend class="mb-2 text-sm font-medium">
                  Tema
                </legend>
                <label class="flex items-center gap-2 text-sm">
                  <input v-model="theme" type="radio" name="reader-theme" value="light">
                  Claro
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <input v-model="theme" type="radio" name="reader-theme" value="dark">
                  Escuro
                </label>
              </fieldset>
            </div>
          </aside>
        </Transition>
      </div>
    </DialogContent>
  </Dialog>
</template>
