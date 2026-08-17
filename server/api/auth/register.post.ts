import { createError, defineEventHandler, readBody } from 'h3'
import { AuthService } from '../../services/auth.service'
import { setSessionCookie } from '../../utils/session'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: unknown, email?: unknown, password?: unknown }>(event)

  if (typeof body?.name !== 'string' || !body.name.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Nome é obrigatório' })
  }
  if (typeof body?.email !== 'string' || !EMAIL_REGEX.test(body.email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email inválido' })
  }
  if (typeof body?.password !== 'string' || body.password.length < MIN_PASSWORD_LENGTH) {
    throw createError({ statusCode: 400, statusMessage: `Senha deve ter ao menos ${MIN_PASSWORD_LENGTH} caracteres` })
  }

  // Cadastro público nunca aceita `role` do cliente — sempre USER.
  await AuthService.register({ name: body.name.trim(), email: body.email, password: body.password })

  const { sessionId, expiresAt, user } = await AuthService.login(body.email, body.password)
  setSessionCookie(event, sessionId, expiresAt)

  return { user }
})
