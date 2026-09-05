import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const technologyCategoryEnum = pgEnum('technology_category', [
  'FRONTEND',
  'BACKEND',
  'API',
  'DATABASE',
  'ORM',
  'CLOUD',
  'DEVOPS',
  'BUILD_TOOLS',
  'TESTING',
  'AI',
  'SECURITY',
  'PAYMENTS',
  'ARCHITECTURE',
  'INFRASTRUCTURE',
  'VERSION_CONTROL',
  'OBSERVABILITY'
])

export const technologies = pgTable('technologies', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  category: technologyCategoryEnum('category').notNull().default('FRONTEND'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})
