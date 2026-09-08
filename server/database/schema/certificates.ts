import { date, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const certificateCategoryEnum = pgEnum('certificate_category', [
  'DESENVOLVIMENTO_WEB',
  'UX_UI_DESIGN',
  'DEVOPS',
  'BACKEND',
  'GESTAO_DE_PROJETOS'
])

export const certificates = pgTable('certificates', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: certificateCategoryEnum('category').notNull(),
  completedAt: date('completed_at').notNull(),
  image: text('image'),
  onlineUrl: text('online_url'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})
