import { createError, defineEventHandler, getQuery, sendRedirect } from 'h3'
import { AuthService } from '../../../services/auth.service'
import { verifyOAuthState } from '../../../utils/oauth-state'
import { getPublicOrigin } from '../../../utils/public-origin'
import { setSessionCookie } from '../../../utils/session'

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

  if (!query.code || typeof query.state !== 'string') {
    throw createError({ statusCode: 400, message: 'Falha na autenticação com o Google (parâmetros ausentes)' })
  }

  const verifiedState = verifyOAuthState(query.state)
  if (!verifiedState) {
    throw createError({ statusCode: 400, message: 'Falha na autenticação com o Google (state inválido)' })
  }
  const redirectTarget = verifiedState.redirect

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
