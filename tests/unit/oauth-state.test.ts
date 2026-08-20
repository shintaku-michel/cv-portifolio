import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createOAuthState, verifyOAuthState } from '../../server/utils/oauth-state'

describe('oauth-state', () => {
  const originalSecret = process.env.GOOGLE_CLIENT_SECRET

  beforeEach(() => {
    process.env.GOOGLE_CLIENT_SECRET = 'segredo-de-teste'
  })

  afterEach(() => {
    process.env.GOOGLE_CLIENT_SECRET = originalSecret
  })

  it('cria e verifica um state válido, preservando o redirect', () => {
    const state = createOAuthState('/posts/algum-post')
    const result = verifyOAuthState(state)
    expect(result).toEqual({ redirect: '/posts/algum-post' })
  })

  it('usa "/" quando nenhum redirect é informado', () => {
    const state = createOAuthState('')
    const result = verifyOAuthState(state)
    expect(result?.redirect).toBe('/')
  })

  it('rejeita redirect absoluto (evita open redirect)', () => {
    const state = createOAuthState('https://evil.example.com')
    const result = verifyOAuthState(state)
    expect(result?.redirect).toBe('/')
  })

  it('rejeita state adulterado', () => {
    const state = createOAuthState('/posts/algum-post')
    const tampered = `${state}x`
    expect(verifyOAuthState(tampered)).toBeNull()
  })

  it('rejeita state assinado com outro segredo', () => {
    const state = createOAuthState('/posts/algum-post')
    process.env.GOOGLE_CLIENT_SECRET = 'outro-segredo'
    expect(verifyOAuthState(state)).toBeNull()
  })

  it('rejeita string malformada', () => {
    expect(verifyOAuthState('nao-eh-um-state-valido')).toBeNull()
  })
})
