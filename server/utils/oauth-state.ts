import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { createError } from 'h3'

// O `state` do OAuth precisa sobreviver ao redirecionamento de ida e volta
// pro Google. Um cookie pareceria natural, mas o Firebase Hosting (CDN na
// frente do Cloud Run) só repassa cookies chamados exatamente "__session"
// em requisições GET — qualquer outro nome de cookie é descartado antes de
// chegar no servidor. Por isso o state (e o destino de redirect) vão
// embutidos e assinados dentro do próprio parâmetro `state`, que o Google
// sempre devolve intacto — sem depender de cookie nenhum.
function getSigningSecret(): string {
  const secret = process.env.GOOGLE_CLIENT_SECRET
  if (!secret) {
    throw createError({ statusCode: 500, message: 'Login com Google não está configurado' })
  }
  return secret
}

function sign(payload: string): string {
  return createHmac('sha256', getSigningSecret()).update(payload).digest('base64url')
}

export function createOAuthState(redirect: string): string {
  const nonce = randomBytes(16).toString('hex')
  const payload = Buffer.from(JSON.stringify({ nonce, redirect })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifyOAuthState(state: string): { redirect: string } | null {
  const [payload, signature] = state.split('.')
  if (!payload || !signature) {
    return null
  }

  const expectedSignature = sign(payload)
  const a = Buffer.from(signature)
  const b = Buffer.from(expectedSignature)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
    const redirect = typeof decoded.redirect === 'string' && decoded.redirect.startsWith('/') && !decoded.redirect.startsWith('//')
      ? decoded.redirect
      : '/'
    return { redirect }
  } catch {
    return null
  }
}
