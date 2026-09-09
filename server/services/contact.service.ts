import { createError } from 'h3'

export type EvaluationType = 'diagnostico-rapido' | 'cafe-virtual'

export type PagarUmCafeInput = {
  name: string
  email: string
  evaluationType: EvaluationType
  description: string
}

const EVALUATION_LABELS: Record<EvaluationType, string> = {
  'diagnostico-rapido': 'Apenas diagnóstico rápido (resposta por e-mail)',
  'cafe-virtual': 'Diagnóstico e café virtual (100% grátis)'
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Domínio próprio verificado na Resend — permite remetente com identidade
// real (em vez do onboarding@resend.dev, que só entrega pra própria conta).
const FROM_ADDRESS = 'Portfolio CMS <contato@shin.dev.br>'

export const ContactService = {
  // Usa a API HTTP da Resend direto via fetch — sem SDK, é só um POST.
  async sendPagarUmCafe(input: PagarUmCafeInput) {
    const apiKey = process.env.RESEND_API_KEY
    const ownerEmail = process.env.OWNER_EMAIL

    if (!apiKey || !ownerEmail) {
      throw createError({ statusCode: 500, message: 'Envio de e-mail não configurado no servidor' })
    }

    const evaluationLabel = EVALUATION_LABELS[input.evaluationType]
    const subject = `Pagar um café — ${input.name}`
    const html = `
      <p><strong>Nome:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Tipo de avaliação:</strong> ${escapeHtml(evaluationLabel)}</p>
      <p><strong>Descrição:</strong></p>
      <p>${escapeHtml(input.description).replace(/\n/g, '<br>')}</p>
    `.trim()

    try {
      await $fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: {
          from: FROM_ADDRESS,
          to: [ownerEmail],
          reply_to: input.email,
          subject,
          html
        }
      })
    } catch {
      throw createError({ statusCode: 502, message: 'Não foi possível enviar sua mensagem agora. Tente novamente em instantes.' })
    }
  }
}
