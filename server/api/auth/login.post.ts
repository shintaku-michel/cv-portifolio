import { createError, defineEventHandler, readBody } from 'h3'
import { AuthService } from '../../services/auth.service'
import { setSessionCookie } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: unknown, password?: unknown }>(event)

  if (typeof body?.email !== 'string' || typeof body?.password !== 'string' || !body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email e senha são obrigatórios' })
  }

  const { sessionId, expiresAt, user } = await AuthService.login(body.email, body.password)
  setSessionCookie(event, sessionId, expiresAt)

  return { user }
})
