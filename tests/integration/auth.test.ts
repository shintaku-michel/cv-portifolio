import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { AuthService } from '../../server/services/auth.service'
import { db } from '../../server/database/client'
import { sessions, users } from '../../server/database/schema'

const testEmail = `test-auth-${randomUUID()}@example.com`
const testPassword = 'senhaDeTeste123'

describe('AuthService (integração)', () => {
  beforeAll(async () => {
    await AuthService.register({ name: 'Usuário de Teste', email: testEmail, password: testPassword, role: 'USER' })
  })

  afterAll(async () => {
    await db.delete(users).where(eq(users.email, testEmail))
    await db.$client.end()
  })

  it('faz login com credenciais corretas e cria uma sessão', async () => {
    const { sessionId, user } = await AuthService.login(testEmail, testPassword)

    expect(sessionId).toBeTypeOf('string')
    expect(user.email).toBe(testEmail)
    expect(user.role).toBe('USER')

    await AuthService.logout(sessionId)
  })

  it('rejeita senha incorreta com erro genérico (sem revelar se o email existe)', async () => {
    await expect(AuthService.login(testEmail, 'senhaErrada')).rejects.toMatchObject({ statusCode: 401 })
  })

  it('rejeita email inexistente com a mesma mensagem de erro', async () => {
    await expect(AuthService.login('nao-existe@example.com', testPassword)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Credenciais inválidas'
    })
  })

  it('getSessionUser resolve o usuário de uma sessão válida', async () => {
    const { sessionId, user } = await AuthService.login(testEmail, testPassword)

    const sessionUser = await AuthService.getSessionUser(sessionId)
    expect(sessionUser).toEqual(user)

    await AuthService.logout(sessionId)
  })

  it('logout invalida a sessão no servidor', async () => {
    const { sessionId } = await AuthService.login(testEmail, testPassword)
    await AuthService.logout(sessionId)

    const sessionUser = await AuthService.getSessionUser(sessionId)
    expect(sessionUser).toBeNull()
  })

  it('sessão expirada não autentica e é removida do banco', async () => {
    const { sessionId } = await AuthService.login(testEmail, testPassword)
    await db.update(sessions).set({ expiresAt: new Date(Date.now() - 1000) }).where(eq(sessions.id, sessionId))

    const sessionUser = await AuthService.getSessionUser(sessionId)
    expect(sessionUser).toBeNull()

    const [remaining] = await db.select().from(sessions).where(eq(sessions.id, sessionId))
    expect(remaining).toBeUndefined()
  })

  it('rejeita cadastro com email já existente (409)', async () => {
    await expect(
      AuthService.register({ name: 'Outro Nome', email: testEmail, password: 'outraSenha123' })
    ).rejects.toMatchObject({ statusCode: 409 })
  })

  it('cadastro público sempre cria usuário com role USER, mesmo se role não for informado', async () => {
    const newEmail = `test-auth-${randomUUID()}@example.com`
    const user = await AuthService.register({ name: 'Novo Usuário', email: newEmail, password: 'senhaValida123' })

    expect(user.role).toBe('USER')

    await db.delete(users).where(eq(users.email, newEmail))
  })

  describe('loginWithGoogle', () => {
    const googleEmail = `test-google-${randomUUID()}@example.com`
    const googleId = `google-${randomUUID()}`

    afterAll(async () => {
      await db.delete(users).where(eq(users.email, googleEmail))
    })

    it('cria a conta no primeiro acesso, sem senha', async () => {
      const { user } = await AuthService.loginWithGoogle({
        googleId,
        email: googleEmail,
        name: 'Leitor Google',
        avatarUrl: 'https://example.com/foto.png'
      })

      expect(user.email).toBe(googleEmail)
      expect(user.role).toBe('USER')

      const [row] = await db.select().from(users).where(eq(users.email, googleEmail))
      expect(row!.passwordHash).toBeNull()
      expect(row!.googleId).toBe(googleId)
    })

    it('reconhece o mesmo usuário em acessos seguintes e atualiza nome/foto', async () => {
      const { user } = await AuthService.loginWithGoogle({
        googleId,
        email: googleEmail,
        name: 'Leitor Google Renomeado',
        avatarUrl: 'https://example.com/nova-foto.png'
      })

      expect(user.name).toBe('Leitor Google Renomeado')

      const all = await db.select().from(users).where(eq(users.email, googleEmail))
      expect(all).toHaveLength(1)
    })

    it('conta Google (sem senha) não consegue logar com senha', async () => {
      await expect(AuthService.login(googleEmail, 'qualquerSenha123')).rejects.toMatchObject({ statusCode: 401 })
    })
  })
})
