import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { checkRateLimit } from '../../server/utils/rate-limit'

describe('checkRateLimit', () => {
  it('permite requisições dentro do limite', () => {
    const key = randomUUID()
    expect(checkRateLimit(key, 3, 1000)).toBe(true)
    expect(checkRateLimit(key, 3, 1000)).toBe(true)
    expect(checkRateLimit(key, 3, 1000)).toBe(true)
  })

  it('bloqueia a partir da requisição que excede o limite', () => {
    const key = randomUUID()
    checkRateLimit(key, 2, 1000)
    checkRateLimit(key, 2, 1000)
    expect(checkRateLimit(key, 2, 1000)).toBe(false)
  })

  it('chaves diferentes têm contadores independentes', () => {
    const keyA = randomUUID()
    const keyB = randomUUID()
    checkRateLimit(keyA, 1, 1000)
    expect(checkRateLimit(keyA, 1, 1000)).toBe(false)
    expect(checkRateLimit(keyB, 1, 1000)).toBe(true)
  })

  it('libera de novo depois que a janela expira', async () => {
    const key = randomUUID()
    checkRateLimit(key, 1, 50)
    expect(checkRateLimit(key, 1, 50)).toBe(false)
    await new Promise(resolve => setTimeout(resolve, 60))
    expect(checkRateLimit(key, 1, 50)).toBe(true)
  })
})
