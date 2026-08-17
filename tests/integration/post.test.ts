import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { db } from '../../server/database/client'
import { categories, posts, users } from '../../server/database/schema'
import { PostService } from '../../server/services/post.service'

const suffix = randomUUID().slice(0, 8)
const authorEmail = `test-post-author-${suffix}@example.com`

let authorId: string
let categoryId: string

describe('PostService (integração)', () => {
  beforeAll(async () => {
    const [author] = await db
      .insert(users)
      .values({ name: 'Autor de Teste', email: authorEmail, passwordHash: 'scrypt:1:1:1:aa:bb', role: 'ADMIN' })
      .returning()
    authorId = author!.id

    const [category] = await db.insert(categories).values({ name: `TestCat-${suffix}`, slug: `testcat-${suffix}` }).returning()
    categoryId = category!.id
  })

  afterAll(async () => {
    await db.delete(posts).where(eq(posts.slug, `post-teste-${suffix}`))
    await db.delete(categories).where(eq(categories.id, categoryId))
    await db.delete(users).where(eq(users.id, authorId))
    await db.$client.end()
  })

  it('cria post como DRAFT com autor e categoria', async () => {
    const post = await PostService.create(authorId, {
      title: 'Post de Teste',
      slug: `post-teste-${suffix}`,
      excerpt: 'resumo',
      content: 'conteúdo completo',
      categoryId
    })

    expect(post?.status).toBe('DRAFT')
    expect(post?.author.id).toBe(authorId)
    expect(post?.category?.id).toBe(categoryId)
  })

  it('post DRAFT não aparece para chamador público', async () => {
    const publicView = await PostService.getBySlug(`post-teste-${suffix}`, { includeDraft: false })
    expect(publicView).toBeNull()
  })

  it('publishPost define publishedAt e torna público', async () => {
    const draft = await PostService.getBySlug(`post-teste-${suffix}`, { includeDraft: true })
    const published = await PostService.publish(draft!.id)

    expect(published?.status).toBe('PUBLISHED')
    expect(published?.publishedAt).not.toBeNull()

    const publicView = await PostService.getBySlug(`post-teste-${suffix}`, { includeDraft: false })
    expect(publicView).not.toBeNull()
  })

  it('featuredPosts inclui o post publicado mais recente', async () => {
    const featured = await PostService.getFeatured()
    expect(featured.some(p => p.slug === `post-teste-${suffix}`)).toBe(true)
  })

  it('unpublishPost limpa publishedAt e some da listagem pública', async () => {
    const post = await PostService.getBySlug(`post-teste-${suffix}`, { includeDraft: true })
    const unpublished = await PostService.unpublish(post!.id)

    expect(unpublished?.status).toBe('DRAFT')
    expect(unpublished?.publishedAt).toBeNull()

    const publicView = await PostService.getBySlug(`post-teste-${suffix}`, { includeDraft: false })
    expect(publicView).toBeNull()
  })
})
