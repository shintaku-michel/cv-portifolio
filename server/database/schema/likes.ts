import { sql } from 'drizzle-orm'
import { check, index, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { posts } from './posts'
import { projects } from './projects'
import { users } from './users'

// Mesmo modelo dos comentários: exatamente um alvo (post OU projeto) via FKs
// exclusivas + CHECK. As uniques por alvo seguem valendo porque o Postgres
// trata NULL como distinto — a curtida de projeto (post_id NULL) não colide.
export const likes = pgTable(
  'likes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
  },
  table => [
    unique('likes_user_post_unique').on(table.userId, table.postId),
    unique('likes_user_project_unique').on(table.userId, table.projectId),
    // A contagem filtra só pelo alvo — as uniques acima não servem pra isso
    // porque o alvo não é a coluna líder.
    index('likes_post_id_idx').on(table.postId),
    index('likes_project_id_idx').on(table.projectId),
    check('likes_single_target_check', sql`num_nonnulls(${table.postId}, ${table.projectId}) = 1`)
  ]
)
