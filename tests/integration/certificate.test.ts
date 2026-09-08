import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { afterAll, describe, expect, it } from 'vitest'
import { db } from '../../server/database/client'
import { certificates } from '../../server/database/schema'
import { CertificateService } from '../../server/services/certificate.service'

const suffix = randomUUID().slice(0, 8)
const title = `Certificado de Teste ${suffix}`

describe('CertificateService (integração)', () => {
  afterAll(async () => {
    await db.delete(certificates).where(eq(certificates.title, title))
    await db.$client.end()
  })

  it('cria certificado', async () => {
    const certificate = await CertificateService.create({
      title,
      description: 'descrição de teste',
      category: 'BACKEND',
      completedAt: '2024-01-01',
      displayOrder: 99
    })

    expect(certificate.title).toBe(title)
    expect(certificate.category).toBe('BACKEND')
    expect(certificate.image).toBeNull()
  })

  it('getAll retorna o certificado criado', async () => {
    const all = await CertificateService.getAll()
    expect(all.some(c => c.title === title)).toBe(true)
  })

  it('update altera os campos informados', async () => {
    const created = await CertificateService.create({
      title: `${title}-update`,
      description: 'x',
      category: 'BACKEND',
      completedAt: '2024-01-01'
    })

    const updated = await CertificateService.update(created.id, { onlineUrl: 'https://example.com' })
    expect(updated.onlineUrl).toBe('https://example.com')

    await db.delete(certificates).where(eq(certificates.id, created.id))
  })

  it('update lança 404 para id inexistente', async () => {
    await expect(
      CertificateService.update(randomUUID(), { title: 'x' })
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it('delete remove o certificado', async () => {
    const created = await CertificateService.create({
      title: `${title}-delete`,
      description: 'x',
      category: 'DEVOPS',
      completedAt: '2024-01-01'
    })

    const deleted = await CertificateService.delete(created.id)
    expect(deleted).toBe(true)

    const afterDelete = await CertificateService.getById(created.id)
    expect(afterDelete).toBeNull()
  })
})
