import { sql } from 'drizzle-orm'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { check, index, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { posts } from './posts'
import { projects } from './projects'
import { users } from './users'

export const commentStatusEnum = pgEnum('comment_status', ['PENDING', 'VISIBLE', 'HIDDEN'])

// Um comentário pertence a exatamente um alvo (post OU projeto). FKs
// exclusivas em vez de uma coluna polimórfica: mantêm integridade
// referencial e ON DELETE CASCADE. Novo alvo = nova coluna + entrar no CHECK.
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id').references((): AnyPgColumn => comments.id, { onDelete: 'cascade' }),
  status: commentStatusEnum('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, table => [
  index('comments_post_id_idx').on(table.postId),
  index('comments_project_id_idx').on(table.projectId),
  index('comments_parent_id_idx').on(table.parentId),
  index('comments_status_idx').on(table.status),
  check('comments_single_target_check', sql`num_nonnulls(${table.postId}, ${table.projectId}) = 1`)
])
