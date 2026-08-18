import { createError, defineEventHandler, getRequestIP, readBody } from 'h3'
import { AuthService } from '../../services/auth.service'
import { checkRateLimit } from '../../utils/rate-limit'
import { setSessionCookie } from '../../utils/session'

const LOGIN_LIMIT = 10
const LOGIN_WINDOW_MS = 15 * 60 * 1000

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!checkRateLimit(`login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS)) {
    throw createError({ statusCode: 429, message: 'Muitas tentativas de login. Tente novamente mais tarde.' })
  }

  const body = await readBody<{ email?: unknown, password?: unknown }>(event)

  if (typeof body?.email !== 'string' || typeof body?.password !== 'string' || !body.email || !body.password) {
    throw createError({ statusCode: 400, message: 'Email e senha são obrigatórios' })
  }

  const { sessionId, expiresAt, user } = await AuthService.login(body.email, body.password)
  setSessionCookie(event, sessionId, expiresAt)

  return { user }
})
