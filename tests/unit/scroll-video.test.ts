import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchBlobWithin, scrollProgress, snapToFrame } from '../../app/utils/scroll-video'

describe('snapToFrame', () => {
  it('aims at the center of the frame that contains the time', () => {
    expect(snapToFrame(0, 10, 24)).toBeCloseTo(0.5 / 24)
    expect(snapToFrame(1.01, 10, 24)).toBeCloseTo(24.5 / 24)
  })

  it('clamps to the last frame and stays inside the duration', () => {
    expect(snapToFrame(10, 10, 24)).toBeCloseTo(239.5 / 24)
    expect(snapToFrame(99, 10, 24)).toBeLessThan(10)
  })

  it('clamps negative times to the first frame', () => {
    expect(snapToFrame(-1, 10, 24)).toBeCloseTo(0.5 / 24)
  })
})

describe('scrollProgress', () => {
  it('is 0 before the section reaches the top and 1 after the sticky range', () => {
    expect(scrollProgress(100, 1000)).toBe(0)
    expect(scrollProgress(-500, 1000)).toBe(0.5)
    expect(scrollProgress(-2000, 1000)).toBe(1)
  })

  it('guards against a zero scrollable range', () => {
    expect(scrollProgress(-10, 0)).toBe(1)
  })
})

describe('fetchBlobWithin', () => {
  // fetch falso: responde depois de `delayMs`, ou rejeita se o sinal abortar antes.
  function stubFetch(delayMs: number, status = 200) {
    vi.stubGlobal('fetch', (_url: string, init: { signal: AbortSignal }) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => resolve(new Response(new Blob(['video']), { status })), delayMs)
      init.signal.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(init.signal.reason)
      })
    }))
  }

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the blob when the download finishes in time', async () => {
    stubFetch(5)
    const blob = await fetchBlobWithin('/hero.mp4', 200, new AbortController().signal)
    expect(await blob.text()).toBe('video')
  })

  it('gives up with a TimeoutError when the download is too slow', async () => {
    stubFetch(500)
    await expect(fetchBlobWithin('/hero.mp4', 20, new AbortController().signal))
      .rejects.toMatchObject({ name: 'TimeoutError' })
  })

  it('rejects with an AbortError when the caller aborts (teardown)', async () => {
    stubFetch(500)
    const controller = new AbortController()
    const pending = fetchBlobWithin('/hero.mp4', 1000, controller.signal)
    controller.abort()
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('rejects on an HTTP error status', async () => {
    stubFetch(5, 404)
    await expect(fetchBlobWithin('/hero.mp4', 200, new AbortController().signal)).rejects.toThrow('HTTP 404')
  })
})
