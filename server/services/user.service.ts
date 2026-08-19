import { eq } from 'drizzle-orm'
import { createError } from 'h3'
import type { UserRole } from '../../shared/types/auth'
import { db } from '../database/client'
import { users } from '../database/schema'

const MAX_BIO_LENGTH = 280

export type UpdateProfileInput = {
  bio?: string | null
  avatarUrl?: string | null
}

export const UserService = {
  async getAll() {
    return db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users).orderBy(users.name)
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const changes: Partial<typeof users.$inferInsert> = { updatedAt: new Date() }

    if (input.bio !== undefined) {
      const bio = input.bio?.trim() || null
      if (bio && bio.length > MAX_BIO_LENGTH) {
        throw createError({ statusCode: 400, message: `Bio deve ter no máximo ${MAX_BIO_LENGTH} caracteres` })
      }
      changes.bio = bio
    }

    if (input.avatarUrl !== undefined) {
      changes.avatarUrl = input.avatarUrl?.trim() || null
    }

    const [updated] = await db
      .update(users)
      .set(changes)
      .where(eq(users.id, userId))
      .returning({ id: users.id, name: users.name, email: users.email, role: users.role, avatarUrl: users.avatarUrl, bio: users.bio })

    if (!updated) {
      throw createError({ statusCode: 404, message: 'Usuário não encontrado' })
    }

    return updated
  },

  async updateRole(currentUserId: string, targetId: string, role: UserRole) {
    if (currentUserId === targetId && role !== 'ADMIN') {
      throw createError({ statusCode: 400, message: 'Você não pode remover a própria permissão de administrador' })
    }

    const [updated] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, targetId))
      .returning({ id: users.id, name: users.name, email: users.email, role: users.role })

    if (!updated) {
      throw createError({ statusCode: 404, message: 'Usuário não encontrado' })
    }

    return updated
  }
}
