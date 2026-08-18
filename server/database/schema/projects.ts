import { boolean, date, index, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const projectStatusEnum = pgEnum('project_status', ['DRAFT', 'PUBLISHED'])

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  shortDescription: text('short_description').notNull(),
  description: text('description').notNull(),
  coverImage: text('cover_image'),
  gallery: text('gallery').array().notNull().default([]),
  status: projectStatusEnum('status').notNull().default('DRAFT'),
  featured: boolean('featured').notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
  demoUrl: text('demo_url'),
  repositoryUrl: text('repository_url'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, table => [index('projects_status_idx').on(table.status)])
