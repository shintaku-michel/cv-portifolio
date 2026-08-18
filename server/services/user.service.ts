import { eq } from 'drizzle-orm'
import { createError } from 'h3'
import type { UserRole } from '../../shared/types/auth'
import { db } from '../database/client'
import { users } from '../database/schema'

export const UserService = {
  async getAll() {
    return db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users).orderBy(users.name)
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
