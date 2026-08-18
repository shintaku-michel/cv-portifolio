import { index, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { posts } from './posts'
import { users } from './users'

export const likes = pgTable(
  'likes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
  },
  table => [
    unique('likes_user_post_unique').on(table.userId, table.postId),
    // countForPost filtra só por postId — a unique acima (userId, postId)
    // não serve pra isso porque postId não é a coluna líder.
    index('likes_post_id_idx').on(table.postId)
  ]
)
