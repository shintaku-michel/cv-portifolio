import { eq } from 'drizzle-orm'
import { createError } from 'h3'
import { db } from '../database/client'
import { comments } from '../database/schema'

export type CreateCommentInput = {
  postId: string
  content: string
  parentId?: string | null
}

type CommentStatus = 'PENDING' | 'VISIBLE' | 'HIDDEN'

const withRelations = { user: true, post: true } as const

export const CommentService = {
  async getVisible(postId: string) {
    return db.query.comments.findMany({
      with: {
        ...withRelations,
        replies: {
          with: { user: true },
          where: (r, { eq }) => eq(r.status, 'VISIBLE'),
          orderBy: (r, { asc }) => [asc(r.createdAt)]
        }
      },
      where: (c, { and, eq, isNull }) => and(eq(c.postId, postId), eq(c.status, 'VISIBLE'), isNull(c.parentId)),
      orderBy: (c, { asc }) => [asc(c.createdAt)]
    })
  },

  async getPending() {
    return CommentService.getByStatus('PENDING')
  },

  // Admin: todos os comentários com o status informado, de qualquer post
  // (seção 15 — admin visualiza pendentes, publicados e ocultos).
  async getByStatus(status: CommentStatus) {
    return db.query.comments.findMany({
      with: withRelations,
      where: (c, { eq }) => eq(c.status, status),
      orderBy: (c, { desc }) => [desc(c.createdAt)]
    })
  },

  async getById(id: string) {
    const comment = await db.query.comments.findFirst({
      with: withRelations,
      where: (c, { eq }) => eq(c.id, id)
    })
    return comment ?? null
  },

  async create(userId: string, input: CreateCommentInput) {
    if (input.parentId) {
      const parent = await db.query.comments.findFirst({ where: (c, { eq }) => eq(c.id, input.parentId!) })
      if (!parent) {
        throw createError({ statusCode: 404, message: 'Comentário pai não encontrado' })
      }
      if (parent.parentId) {
        throw createError({ statusCode: 400, message: 'Respostas só podem ter um nível de profundidade' })
      }
    }

    const [comment] = await db
      .insert(comments)
      .values({
        content: input.content,
        postId: input.postId,
        parentId: input.parentId ?? null,
        userId,
        status: 'PENDING'
      })
      .returning()

    return CommentService.getById(comment!.id)
  },

  async setStatus(id: string, status: CommentStatus) {
    const [updated] = await db.update(comments).set({ status, updatedAt: new Date() }).where(eq(comments.id, id)).returning()
    if (!updated) {
      throw createError({ statusCode: 404, message: 'Comentário não encontrado' })
    }
    return CommentService.getById(updated.id)
  },

  async approve(id: string) {
    return CommentService.setStatus(id, 'VISIBLE')
  },

  async hide(id: string) {
    return CommentService.setStatus(id, 'HIDDEN')
  },

  async delete(id: string) {
    const [deleted] = await db.delete(comments).where(eq(comments.id, id)).returning()
    return Boolean(deleted)
  }
}
