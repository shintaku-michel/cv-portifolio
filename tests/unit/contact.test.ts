import { afterEach, describe, expect, it } from 'vitest'
import { ContactService } from '../../server/services/contact.service'

const VALID_INPUT = {
  name: 'Ana Teste',
  email: 'ana@example.com',
  evaluationType: 'cafe-virtual' as const,
  description: 'Preciso de ajuda com performance.'
}

describe('ContactService.sendPagarUmCafe', () => {
  const originalApiKey = process.env.RESEND_API_KEY
  const originalOwnerEmail = process.env.OWNER_EMAIL

  afterEach(() => {
    process.env.RESEND_API_KEY = originalApiKey
    process.env.OWNER_EMAIL = originalOwnerEmail
  })

  it('lança 500 quando RESEND_API_KEY não está configurada', async () => {
    delete process.env.RESEND_API_KEY
    process.env.OWNER_EMAIL = 'owner@example.com'

    await expect(ContactService.sendPagarUmCafe(VALID_INPUT)).rejects.toMatchObject({ statusCode: 500 })
  })

  it('lança 500 quando OWNER_EMAIL não está configurado', async () => {
    process.env.RESEND_API_KEY = 'test-key'
    delete process.env.OWNER_EMAIL

    await expect(ContactService.sendPagarUmCafe(VALID_INPUT)).rejects.toMatchObject({ statusCode: 500 })
  })
})
