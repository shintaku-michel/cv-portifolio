import type { H3Event } from 'h3'
import { deleteCookie, getCookie, setCookie } from 'h3'
import { AuthService, type SessionUser } from '../services/auth.service'

export const SESSION_COOKIE_NAME = 'session_id'

export function setSessionCookie(event: H3Event, sessionId: string, expiresAt: Date) {
  setCookie(event, SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt
  })
}

export function clearSessionCookie(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE_NAME, { path: '/' })
}

// Sempre revalida a sessão contra o banco — nunca confia em dado de role
// vindo do cliente (seção 19/20 do CLAUDE.md).
export async function getCurrentUser(event: H3Event): Promise<SessionUser | null> {
  const sessionId = getCookie(event, SESSION_COOKIE_NAME)
  if (!sessionId) {
    return null
  }

  const user = await AuthService.getSessionUser(sessionId)
  if (!user) {
    clearSessionCookie(event)
  }

  return user
}
