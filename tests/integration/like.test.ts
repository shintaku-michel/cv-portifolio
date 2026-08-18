import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { db } from '../../server/database/client'
import { posts, users } from '../../server/database/schema'
import { LikeService } from '../../server/services/like.service'

const suffix = randomUUID().slice(0, 8)
const userEmail = `test-like-user-${suffix}@example.com`

let userId: string
let postId: string

describe('LikeService (integração)', () => {
  beforeAll(async () => {
    const [user] = await db
      .insert(users)
      .values({ name: 'Curtidor', email: userEmail, passwordHash: 'scrypt:1:1:1:aa:bb', role: 'USER' })
      .returning()
    userId = user!.id

    const [post] = await db
      .insert(posts)
      .values({
        title: 'Post para Likes',
        slug: `post-likes-${suffix}`,
        excerpt: 'x',
        content: 'y',
        authorId: userId,
        status: 'PUBLISHED'
      })
      .returning()
    postId = post!.id
  })

  afterAll(async () => {
    await db.delete(posts).where(eq(posts.id, postId))
    await db.delete(users).where(eq(users.id, userId))
    await db.$client.end()
  })

  it('post começa sem likes', async () => {
    expect(await LikeService.countForPost(postId)).toBe(0)
    expect(await LikeService.isLikedBy(postId, userId)).toBe(false)
  })

  it('like incrementa a contagem e marca como curtido', async () => {
    await LikeService.like(postId, userId)
    expect(await LikeService.countForPost(postId)).toBe(1)
    expect(await LikeService.isLikedBy(postId, userId)).toBe(true)
  })

  it('curtir de novo é idempotente (restrição de unicidade)', async () => {
    await LikeService.like(postId, userId)
    expect(await LikeService.countForPost(postId)).toBe(1)
  })

  it('unlike remove o like', async () => {
    await LikeService.unlike(postId, userId)
    expect(await LikeService.countForPost(postId)).toBe(0)
    expect(await LikeService.isLikedBy(postId, userId)).toBe(false)
  })

  it('unlike sem like existente não lança erro', async () => {
    await expect(LikeService.unlike(postId, userId)).resolves.not.toThrow()
  })
})
