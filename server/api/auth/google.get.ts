import { createError, defineEventHandler, getQuery, sendRedirect } from 'h3'
import { createOAuthState } from '../../utils/oauth-state'
import { getPublicOrigin } from '../../utils/public-origin'

export default defineEventHandler((event) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw createError({ statusCode: 500, message: 'Login com Google não está configurado' })
  }

  const redirectTarget = String(getQuery(event).redirect ?? '/')
  const state = createOAuthState(redirectTarget)

  const callbackUrl = new URL('/api/auth/google/callback', getPublicOrigin(event))

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', callbackUrl.toString())
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('state', state)

  return sendRedirect(event, authUrl.toString())
})
