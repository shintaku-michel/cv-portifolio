import { createError, defineEventHandler, getRequestIP, readBody } from 'h3'
import { AuthService } from '../../services/auth.service'
import { checkRateLimit } from '../../utils/rate-limit'
import { setSessionCookie } from '../../utils/session'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8
const MAX_NAME_LENGTH = 100

const REGISTER_LIMIT = 5
const REGISTER_WINDOW_MS = 60 * 60 * 1000

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!checkRateLimit(`register:${ip}`, REGISTER_LIMIT, REGISTER_WINDOW_MS)) {
    throw createError({ statusCode: 429, message: 'Muitas tentativas de cadastro. Tente novamente mais tarde.' })
  }

  const body = await readBody<{ name?: unknown, email?: unknown, password?: unknown }>(event)

  if (typeof body?.name !== 'string' || !body.name.trim() || body.name.trim().length > MAX_NAME_LENGTH) {
    throw createError({ statusCode: 400, message: `Nome é obrigatório (máximo ${MAX_NAME_LENGTH} caracteres)` })
  }
  if (typeof body?.email !== 'string' || !EMAIL_REGEX.test(body.email)) {
    throw createError({ statusCode: 400, message: 'Email inválido' })
  }
  if (typeof body?.password !== 'string' || body.password.length < MIN_PASSWORD_LENGTH) {
    throw createError({ statusCode: 400, message: `Senha deve ter ao menos ${MIN_PASSWORD_LENGTH} caracteres` })
  }

  // Cadastro público nunca aceita `role` do cliente — sempre USER.
  await AuthService.register({ name: body.name.trim(), email: body.email, password: body.password })

  const { sessionId, expiresAt, user } = await AuthService.login(body.email, body.password)
  setSessionCookie(event, sessionId, expiresAt)

  return { user }
})
