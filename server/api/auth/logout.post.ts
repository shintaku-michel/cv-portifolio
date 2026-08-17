import { defineEventHandler, getCookie } from 'h3'
import { AuthService } from '../../services/auth.service'
import { clearSessionCookie, SESSION_COOKIE_NAME } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, SESSION_COOKIE_NAME)

  if (sessionId) {
    await AuthService.logout(sessionId)
  }

  clearSessionCookie(event)

  return { success: true }
})
