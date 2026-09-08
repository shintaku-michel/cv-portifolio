import { eq } from 'drizzle-orm'
import { createError } from 'h3'
import { db } from '../database/client'
import { certificates } from '../database/schema'

export type CertificateCategory = (typeof certificates.category.enumValues)[number]

export type CreateCertificateInput = {
  title: string
  description: string
  category: CertificateCategory
  completedAt: string
  image?: string | null
  onlineUrl?: string | null
  displayOrder?: number
}

export type UpdateCertificateInput = Partial<CreateCertificateInput>

export const CertificateService = {
  async getAll() {
    return db.query.certificates.findMany({
      orderBy: (c, { asc }) => [asc(c.displayOrder), asc(c.title)]
    })
  },

  async getById(id: string) {
    const row = await db.query.certificates.findFirst({ where: (c, { eq }) => eq(c.id, id) })
    return row ?? null
  },

  async create(input: CreateCertificateInput) {
    const [certificate] = await db
      .insert(certificates)
      .values({
        title: input.title,
        description: input.description,
        category: input.category,
        completedAt: input.completedAt,
        image: input.image,
        onlineUrl: input.onlineUrl,
        displayOrder: input.displayOrder ?? 0
      })
      .returning()
    return certificate!
  },

  async update(id: string, input: UpdateCertificateInput) {
    const [updated] = await db
      .update(certificates)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(certificates.id, id))
      .returning()
    if (!updated) {
      throw createError({ statusCode: 404, message: 'Certificado não encontrado' })
    }
    return updated
  },

  async delete(id: string) {
    const [deleted] = await db.delete(certificates).where(eq(certificates.id, id)).returning()
    return Boolean(deleted)
  }
}
