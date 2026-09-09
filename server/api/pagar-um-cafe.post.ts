import { createError, defineEventHandler, getRequestIP, readBody } from 'h3'
import { ContactService } from '../services/contact.service'
import type { EvaluationType } from '../services/contact.service'
import { checkRateLimit } from '../utils/rate-limit'

// Formulário público e sem autenticação — mais restritivo que o rate limit
// de login, já que não há motivo legítimo pra alguém enviar isso repetidas
// vezes em pouco tempo.
const LIMIT = 3
const WINDOW_MS = 60 * 60 * 1000

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EVALUATION_TYPES: EvaluationType[] = ['diagnostico-rapido', 'cafe-virtual']

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!checkRateLimit(`pagar-um-cafe:${ip}`, LIMIT, WINDOW_MS)) {
    throw createError({ statusCode: 429, message: 'Muitas mensagens enviadas. Tente novamente mais tarde.' })
  }

  const body = await readBody<{
    name?: unknown
    email?: unknown
    evaluationType?: unknown
    description?: unknown
  }>(event)

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const evaluationType = body?.evaluationType
  const description = typeof body?.description === 'string' ? body.description.trim() : ''

  if (!name || name.length > 200) {
    throw createError({ statusCode: 400, message: 'Nome inválido' })
  }
  if (!email || email.length > 200 || !EMAIL_REGEX.test(email)) {
    throw createError({ statusCode: 400, message: 'Email inválido' })
  }
  if (typeof evaluationType !== 'string' || !EVALUATION_TYPES.includes(evaluationType as EvaluationType)) {
    throw createError({ statusCode: 400, message: 'Tipo de avaliação inválido' })
  }
  if (!description || description.length > 5000) {
    throw createError({ statusCode: 400, message: 'Descrição inválida' })
  }

  await ContactService.sendPagarUmCafe({ name, email, evaluationType: evaluationType as EvaluationType, description })

  return { success: true }
})
