import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { ContentRef } from '../../shared/types/content'
import { db } from '../../server/database/client'
import { likes, posts, projects, users } from '../../server/database/schema'
import { LikeService } from '../../server/services/like.service'

const suffix = randomUUID().slice(0, 8)
const userEmail = `test-like-user-${suffix}@example.com`

let userId: string
let postId: string
let projectId: string
let draftProjectId: string
let post: ContentRef
let project: ContentRef

describe('LikeService (integração)', () => {
  beforeAll(async () => {
    const [user] = await db
      .insert(users)
      .values({ name: 'Curtidor', email: userEmail, passwordHash: 'scrypt:1:1:1:aa:bb', role: 'USER' })
      .returning()
    userId = user!.id

    const [created] = await db
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
    postId = created!.id
    post = { type: 'POST', id: postId }

    const [published, draft] = await db
      .insert(projects)
      .values([
        { title: 'Componente para Likes', slug: `componente-likes-${suffix}`, shortDescription: 'x', description: 'y', status: 'PUBLISHED' },
        { title: 'Componente Rascunho', slug: `componente-likes-rascunho-${suffix}`, shortDescription: 'x', description: 'y', status: 'DRAFT' }
      ])
      .returning()
    projectId = published!.id
    draftProjectId = draft!.id
    project = { type: 'PROJECT', id: projectId }
  })

  afterAll(async () => {
    await db.delete(posts).where(eq(posts.id, postId))
    await db.delete(projects).where(eq(projects.id, projectId))
    await db.delete(projects).where(eq(projects.id, draftProjectId))
    await db.delete(users).where(eq(users.id, userId))
    await db.$client.end()
  })

  describe('em posts', () => {
    it('post começa sem likes', async () => {
      expect(await LikeService.countFor(post)).toBe(0)
      expect(await LikeService.isLikedBy(post, userId)).toBe(false)
    })

    it('like incrementa a contagem e marca como curtido', async () => {
      await LikeService.like(post, userId)
      expect(await LikeService.countFor(post)).toBe(1)
      expect(await LikeService.isLikedBy(post, userId)).toBe(true)
    })

    it('curtir de novo é idempotente (restrição de unicidade)', async () => {
      await LikeService.like(post, userId)
      expect(await LikeService.countFor(post)).toBe(1)
    })

    it('unlike remove o like', async () => {
      await LikeService.unlike(post, userId)
      expect(await LikeService.countFor(post)).toBe(0)
      expect(await LikeService.isLikedBy(post, userId)).toBe(false)
    })

    it('unlike sem like existente não lança erro', async () => {
      await expect(LikeService.unlike(post, userId)).resolves.not.toThrow()
    })
  })

  describe('em projetos/componentes', () => {
    it('curte, é idempotente e descurte o projeto', async () => {
      await LikeService.like(project, userId)
      await LikeService.like(project, userId)
      expect(await LikeService.countFor(project)).toBe(1)
      expect(await LikeService.isLikedBy(project, userId)).toBe(true)

      await LikeService.unlike(project, userId)
      expect(await LikeService.countFor(project)).toBe(0)
    })

    it('curtidas de post e de projeto não se misturam', async () => {
      await LikeService.like(project, userId)
      expect(await LikeService.countFor(post)).toBe(0)
      expect(await LikeService.isLikedBy(post, userId)).toBe(false)
      await LikeService.unlike(project, userId)
    })
  })

  describe('validações', () => {
    it('rejeita curtir projeto DRAFT com 404', async () => {
      await expect(LikeService.like({ type: 'PROJECT', id: draftProjectId }, userId)).rejects.toMatchObject({ statusCode: 404 })
    })

    it('rejeita alvo inexistente ou com id inválido com 404', async () => {
      await expect(LikeService.like({ type: 'POST', id: randomUUID() }, userId)).rejects.toMatchObject({ statusCode: 404 })
      await expect(LikeService.like({ type: 'PROJECT', id: 'nao-e-uuid' }, userId)).rejects.toMatchObject({ statusCode: 404 })
    })

    it('o banco exige exatamente um alvo por curtida', async () => {
      await expect(db.insert(likes).values({ userId })).rejects.toThrow()
      await expect(db.insert(likes).values({ userId, postId, projectId })).rejects.toThrow()
    })
  })
})
