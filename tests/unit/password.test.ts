import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from '../../server/utils/password'

describe('password hashing', () => {
  it('verifica a senha correta', async () => {
    const hash = await hashPassword('minhaSenhaSegura123')
    await expect(verifyPassword(hash, 'minhaSenhaSegura123')).resolves.toBe(true)
  })

  it('rejeita senha incorreta', async () => {
    const hash = await hashPassword('minhaSenhaSegura123')
    await expect(verifyPassword(hash, 'outraSenha')).resolves.toBe(false)
  })

  it('gera salts diferentes (hashes diferentes) para a mesma senha', async () => {
    const [hashA, hashB] = await Promise.all([hashPassword('mesmaSenha'), hashPassword('mesmaSenha')])
    expect(hashA).not.toBe(hashB)
  })

  it('nunca armazena a senha em texto puro dentro do hash', async () => {
    const hash = await hashPassword('senhaSecreta')
    expect(hash).not.toContain('senhaSecreta')
  })

  it('rejeita hash em formato inválido sem lançar exceção', async () => {
    await expect(verifyPassword('formato-invalido', 'qualquer')).resolves.toBe(false)
  })
})
