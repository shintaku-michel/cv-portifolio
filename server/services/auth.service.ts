import { randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { createError } from 'h3'
import type { SessionUser, UserRole } from '../../shared/types/auth'
import { db } from '../database/client'
import { sessions, users } from '../database/schema'
import { isUniqueViolation } from '../utils/db-errors'
import { hashPassword, verifyPassword } from '../utils/password'

export type { SessionUser } from '../../shared/types/auth'

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

function toSessionUser(user: { id: string, name: string, email: string, role: UserRole }): SessionUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export const AuthService = {
  async login(email: string, password: string): Promise<{ sessionId: string, expiresAt: Date, user: SessionUser }> {
    const normalizedEmail = email.trim().toLowerCase()
    const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1)

    // Mesma mensagem de erro para email inexistente ou senha errada,
    // para não permitir enumeração de contas.
    const invalidCredentialsError = createError({ statusCode: 401, message: 'Credenciais inválidas' })

    // Contas Google não têm senha (passwordHash null) — nunca autenticam por aqui.
    if (!user || !user.passwordHash) {
      throw invalidCredentialsError
    }

    const passwordMatches = await verifyPassword(user.passwordHash, password)
    if (!passwordMatches) {
      throw invalidCredentialsError
    }

    const sessionId = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

    await db.insert(sessions).values({ id: sessionId, userId: user.id, expiresAt })

    return { sessionId, expiresAt, user: toSessionUser(user) }
  },

  // Cria sessão a partir do perfil devolvido pelo Google — cria a conta no
  // primeiro acesso (sem senha) ou atualiza nome/foto se já existir.
  async loginWithGoogle(profile: { googleId: string, email: string, name: string, avatarUrl: string | null }) {
    const normalizedEmail = profile.email.trim().toLowerCase()

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, profile.googleId))
      .limit(1)

    let user = existing

    if (!user) {
      const [existingByEmail] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1)

      if (existingByEmail) {
        const [updated] = await db
          .update(users)
          .set({ googleId: profile.googleId, name: profile.name, avatarUrl: profile.avatarUrl, updatedAt: new Date() })
          .where(eq(users.id, existingByEmail.id))
          .returning()
        user = updated
      } else {
        const [created] = await db
          .insert(users)
          .values({
            name: profile.name,
            email: normalizedEmail,
            googleId: profile.googleId,
            avatarUrl: profile.avatarUrl,
            role: 'USER'
          })
          .returning()
        user = created
      }
    } else {
      const [updated] = await db
        .update(users)
        .set({ name: profile.name, avatarUrl: profile.avatarUrl, updatedAt: new Date() })
        .where(eq(users.id, user.id))
        .returning()
      user = updated
    }

    const sessionId = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
    await db.insert(sessions).values({ id: sessionId, userId: user!.id, expiresAt })

    return { sessionId, expiresAt, user: toSessionUser(user!) }
  },

  async logout(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId))
  },

  async getSessionUser(sessionId: string): Promise<SessionUser | null> {
    const [row] = await db
      .select({ user: users, expiresAt: sessions.expiresAt })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))
      .limit(1)

    if (!row) {
      return null
    }

    if (row.expiresAt.getTime() <= Date.now()) {
      await db.delete(sessions).where(eq(sessions.id, sessionId))
      return null
    }

    return toSessionUser(row.user)
  },

  async register(input: { name: string, email: string, password: string, role?: UserRole }) {
    const passwordHash = await hashPassword(input.password)

    try {
      const [user] = await db
        .insert(users)
        .values({
          name: input.name,
          email: input.email.trim().toLowerCase(),
          passwordHash,
          role: input.role ?? 'USER'
        })
        .returning()

      return toSessionUser(user!)
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw createError({ statusCode: 409, message: 'Este email já está cadastrado' })
      }
      throw error
    }
  }
}
