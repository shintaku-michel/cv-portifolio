import type { H3Event } from 'h3'
import { getRequestHeader, getRequestURL } from 'h3'

// getRequestURL(event).origin reflete o host que o Cloud Run enxerga na
// conexão — atrás do rewrite do Firebase Hosting, isso é o próprio domínio
// interno do Cloud Run (*.run.app), não o domínio que o navegador visitou
// (web.app ou o domínio próprio). Sem isso, redirect_uri do OAuth do
// Google nunca bate com o que está registrado no console.
export function getPublicOrigin(event: H3Event): string {
  const forwardedHost = getRequestHeader(event, 'x-forwarded-host') ?? getRequestHeader(event, 'x-fh-requested-host')
  if (forwardedHost) {
    const proto = getRequestHeader(event, 'x-forwarded-proto') ?? 'https'
    return `${proto}://${forwardedHost}`
  }
  return getRequestURL(event).origin
}
