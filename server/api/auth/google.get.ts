import { randomBytes } from 'node:crypto'
import { createError, defineEventHandler, getQuery, getRequestURL, sendRedirect, setCookie } from 'h3'

export const OAUTH_STATE_COOKIE = 'google_oauth_state'

// Guarda pra onde voltar depois do login (ex: o post onde o leitor
// tentou comentar). Vai dentro do cookie de state pra não depender de
// query params que o Google não repassa no callback.
export const OAUTH_REDIRECT_COOKIE = 'google_oauth_redirect'

export default defineEventHandler((event) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw createError({ statusCode: 500, message: 'Login com Google não está configurado' })
  }

  const state = randomBytes(16).toString('hex')
  setCookie(event, OAUTH_STATE_COOKIE, state, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 600 })

  const redirectTarget = String(getQuery(event).redirect ?? '/')
  setCookie(event, OAUTH_REDIRECT_COOKIE, redirectTarget, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 600 })

  const callbackUrl = new URL('/api/auth/google/callback', getRequestURL(event).origin)

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', callbackUrl.toString())
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('state', state)

  return sendRedirect(event, authUrl.toString())
})
