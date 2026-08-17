import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const technologies = pgTable('technologies', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})
