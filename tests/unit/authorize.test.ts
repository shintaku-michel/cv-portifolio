import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../server/services/auth.service'
import { assertAdmin, assertAuthenticated } from '../../server/utils/authorize'

const adminUser: SessionUser = { id: '1', name: 'Admin', email: 'admin@portfolio-cms.dev', role: 'ADMIN' }
const regularUser: SessionUser = { id: '2', name: 'Leitor', email: 'leitor@portfolio-cms.dev', role: 'USER' }

describe('assertAuthenticated', () => {
  it('lança 401 quando não há usuário', () => {
    expect(() => assertAuthenticated(null)).toThrowError(
      expect.objectContaining({ statusCode: 401 })
    )
  })

  it('não lança quando há usuário autenticado', () => {
    expect(() => assertAuthenticated(regularUser)).not.toThrow()
  })
})

describe('assertAdmin', () => {
  it('lança 401 quando não há usuário', () => {
    expect(() => assertAdmin(null)).toThrowError(
      expect.objectContaining({ statusCode: 401 })
    )
  })

  it('lança 403 quando o usuário não é ADMIN', () => {
    expect(() => assertAdmin(regularUser)).toThrowError(
      expect.objectContaining({ statusCode: 403 })
    )
  })

  it('não lança para usuário ADMIN', () => {
    expect(() => assertAdmin(adminUser)).not.toThrow()
  })
})
