import { and, count, eq } from 'drizzle-orm'
import { db } from '../database/client'
import { likes } from '../database/schema'

export const LikeService = {
  async countForPost(postId: string) {
    const [row] = await db.select({ value: count() }).from(likes).where(eq(likes.postId, postId))
    return row?.value ?? 0
  },

  async isLikedBy(postId: string, userId: string) {
    const [row] = await db
      .select({ id: likes.id })
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
      .limit(1)
    return Boolean(row)
  },

  async like(postId: string, userId: string) {
    await db.insert(likes).values({ postId, userId }).onConflictDoNothing()
  },

  async unlike(postId: string, userId: string) {
    await db.delete(likes).where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
  }
}
