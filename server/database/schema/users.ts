import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN'])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  // Null para contas Google (leitores) — só o ADMIN tem senha.
  passwordHash: text('password_hash'),
  googleId: text('google_id').unique(),
  role: userRoleEnum('role').notNull().default('USER'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})
