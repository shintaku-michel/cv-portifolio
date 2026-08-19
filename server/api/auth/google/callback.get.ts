import { createError, deleteCookie, defineEventHandler, getCookie, getQuery, sendRedirect } from 'h3'
import { AuthService } from '../../../services/auth.service'
import { getPublicOrigin } from '../../../utils/public-origin'
import { setSessionCookie } from '../../../utils/session'
import { OAUTH_REDIRECT_COOKIE, OAUTH_STATE_COOKIE } from '../google.get'

interface GoogleTokenResponse {
  access_token: string
}

interface GoogleUserInfo {
  sub: string
  email: string
  email_verified: boolean
  name?: string
  picture?: string
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const rawRedirect = getCookie(event, OAUTH_REDIRECT_COOKIE)
  deleteCookie(event, OAUTH_REDIRECT_COOKIE, { path: '/' })
  // Só aceita caminho relativo interno — evita open redirect via cookie manipulado.
  const redirectTarget = rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/'

  const expectedState = getCookie(event, OAUTH_STATE_COOKIE)
  deleteCookie(event, OAUTH_STATE_COOKIE, { path: '/' })

  if (!query.code || !query.state || query.state !== expectedState) {
    throw createError({ statusCode: 400, message: 'Falha na autenticação com o Google (state inválido)' })
  }

  const callbackUrl = new URL('/api/auth/google/callback', getPublicOrigin(event))

  const tokenResponse = await $fetch<GoogleTokenResponse>('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: {
      code: String(query.code),
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: callbackUrl.toString(),
      grant_type: 'authorization_code'
    }
  })

  const profile = await $fetch<GoogleUserInfo>('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
  })

  if (!profile.email_verified) {
    throw createError({ statusCode: 403, message: 'Email do Google não verificado' })
  }

  const { sessionId, expiresAt } = await AuthService.loginWithGoogle({
    googleId: profile.sub,
    email: profile.email,
    name: profile.name?.trim() || profile.email,
    avatarUrl: profile.picture ?? null
  })

  setSessionCookie(event, sessionId, expiresAt)

  return sendRedirect(event, redirectTarget)
})
