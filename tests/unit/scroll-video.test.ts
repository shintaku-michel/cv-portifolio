import { describe, expect, it } from 'vitest'
import { scrollProgress, snapToFrame } from '../../app/utils/scroll-video'

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
