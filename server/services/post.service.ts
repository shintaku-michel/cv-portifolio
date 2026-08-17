import { eq } from 'drizzle-orm'
import { createError } from 'h3'
import { db } from '../database/client'
import { postTags, posts } from '../database/schema'
import { isUniqueViolation } from '../utils/db-errors'

type Tag = { id: string, name: string, slug: string, createdAt: Date }
type PostWithRelationsRow = { postTags: { tag: Tag }[] } & Record<string, unknown>

function toPost<T extends PostWithRelationsRow>(row: T) {
  const { postTags: relations, ...rest } = row
  return { ...rest, tags: relations.map(r => r.tag) }
}

const FEATURED_POSTS_LIMIT = 3

export type CreatePostInput = {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  categoryId?: string | null
  tagIds?: string[]
}

export type UpdatePostInput = Partial<CreatePostInput>

async function setTags(postId: string, tagIds: string[] | undefined) {
  if (tagIds === undefined) {
    return
  }
  await db.delete(postTags).where(eq(postTags.postId, postId))
  if (tagIds.length > 0) {
    await db.insert(postTags).values(tagIds.map(tagId => ({ postId, tagId })))
  }
}

const withRelations = {
  author: true,
  category: true,
  postTags: { with: { tag: true } }
} as const

export const PostService = {
  async getAll() {
    const rows = await db.query.posts.findMany({
      with: withRelations,
      orderBy: (p, { desc }) => [desc(p.createdAt)]
    })
    return rows.map(toPost)
  },

  async getPublished() {
    const rows = await db.query.posts.findMany({
      with: withRelations,
      where: (p, { eq }) => eq(p.status, 'PUBLISHED'),
      orderBy: (p, { desc }) => [desc(p.publishedAt)]
    })
    return rows.map(toPost)
  },

  // Não há campo `featured` no modelo de Post (seção 12) — interpretado
  // como os posts publicados mais recentes.
  async getFeatured() {
    const rows = await db.query.posts.findMany({
      with: withRelations,
      where: (p, { eq }) => eq(p.status, 'PUBLISHED'),
      orderBy: (p, { desc }) => [desc(p.publishedAt)],
      limit: FEATURED_POSTS_LIMIT
    })
    return rows.map(toPost)
  },

  // `includeDraft: true` só deve ser usado quando o chamador já foi validado
  // como ADMIN no resolver — posts DRAFT nunca podem vazar publicamente.
  async getBySlug(slug: string, options: { includeDraft: boolean }) {
    const row = await db.query.posts.findFirst({
      with: withRelations,
      where: (p, { eq }) => eq(p.slug, slug)
    })
    if (!row) {
      return null
    }
    if (row.status === 'DRAFT' && !options.includeDraft) {
      return null
    }
    return toPost(row)
  },

  async create(authorId: string, input: CreatePostInput) {
    try {
      const [post] = await db
        .insert(posts)
        .values({
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          content: input.content,
          coverImage: input.coverImage,
          categoryId: input.categoryId,
          authorId
        })
        .returning()

      await setTags(post!.id, input.tagIds)
      return PostService.getBySlug(post!.slug, { includeDraft: true })
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw createError({ statusCode: 409, message: 'Já existe um post com esse slug' })
      }
      throw error
    }
  },

  async update(id: string, input: UpdatePostInput) {
    const { tagIds, ...fields } = input

    try {
      if (Object.keys(fields).length > 0) {
        await db.update(posts).set({ ...fields, updatedAt: new Date() }).where(eq(posts.id, id))
      }
      await setTags(id, tagIds)
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw createError({ statusCode: 409, message: 'Já existe um post com esse slug' })
      }
      throw error
    }

    const updated = await db.query.posts.findFirst({ with: withRelations, where: (p, { eq }) => eq(p.id, id) })
    if (!updated) {
      throw createError({ statusCode: 404, message: 'Post não encontrado' })
    }
    return toPost(updated)
  },

  async setStatus(id: string, status: 'DRAFT' | 'PUBLISHED') {
    const [updated] = await db
      .update(posts)
      .set({
        status,
        updatedAt: new Date(),
        publishedAt: status === 'PUBLISHED' ? new Date() : null
      })
      .where(eq(posts.id, id))
      .returning()

    if (!updated) {
      throw createError({ statusCode: 404, message: 'Post não encontrado' })
    }
    return PostService.getBySlug(updated.slug, { includeDraft: true })
  },

  async publish(id: string) {
    return PostService.setStatus(id, 'PUBLISHED')
  },

  async unpublish(id: string) {
    return PostService.setStatus(id, 'DRAFT')
  },

  async delete(id: string) {
    const [deleted] = await db.delete(posts).where(eq(posts.id, id)).returning()
    return Boolean(deleted)
  }
}
