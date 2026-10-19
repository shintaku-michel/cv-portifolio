import { and, count, eq } from 'drizzle-orm'
import { createError } from 'h3'
import type { CommentStatus, CommentTarget, CommentTargetRef } from '../../shared/types/comment'
import { db } from '../database/client'
import { comments, posts, projects } from '../database/schema'

export type CreateCommentInput = {
  target: CommentTargetRef
  content: string
  parentId?: string | null
}

export const COMMENT_MAX_LENGTH = 2000

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Só o necessário para montar o CommentTarget — nunca o conteúdo inteiro do alvo.
const targetColumns = { columns: { id: true, title: true, slug: true } } as const
const withRelations = { user: true, post: targetColumns, project: targetColumns } as const

// Cada tipo de alvo em um só lugar: coluna em `comments` e URL pública.
// Novo alvo = nova entrada aqui, em isPublishedTarget e coluna/CHECK no schema.
const TARGETS = {
  POST: { key: 'postId', path: '/posts' },
  PROJECT: { key: 'projectId', path: '/projetos' }
} as const

type TargetColumns = Pick<typeof comments, 'postId' | 'projectId'>

// Recebe as colunas porque as queries relacionais do drizzle usam alias —
// lá o filtro precisa das colunas do callback, não de `comments`.
function targetFilter(columns: TargetColumns, target: CommentTargetRef) {
  return eq(columns[TARGETS[target.type].key], target.id)
}

function targetValues(target: CommentTargetRef) {
  return { [TARGETS[target.type].key]: target.id }
}

function isSameTarget(row: { postId: string | null, projectId: string | null }, target: CommentTargetRef) {
  return row[TARGETS[target.type].key] === target.id
}

type TargetSummary = { id: string, title: string, slug: string }

export function toCommentTarget(row: { post?: TargetSummary | null, project?: TargetSummary | null }): CommentTarget {
  if (row.post) {
    return { type: 'POST', ...row.post, url: `${TARGETS.POST.path}/${row.post.slug}` }
  }
  if (row.project) {
    return { type: 'PROJECT', ...row.project, url: `${TARGETS.PROJECT.path}/${row.project.slug}` }
  }
  // O CHECK do banco garante um alvo; chegar aqui é query sem os relacionamentos.
  throw new Error('Comentário carregado sem post/projeto')
}

async function isPublishedTarget(target: CommentTargetRef): Promise<boolean> {
  if (!UUID_PATTERN.test(target.id)) {
    return false
  }
  const [row] = target.type === 'POST'
    ? await db.select({ status: posts.status }).from(posts).where(eq(posts.id, target.id)).limit(1)
    : await db.select({ status: projects.status }).from(projects).where(eq(projects.id, target.id)).limit(1)
  return row?.status === 'PUBLISHED'
}

function normalizeContent(content: string): string {
  const trimmed = content.trim()
  if (!trimmed) {
    throw createError({ statusCode: 400, message: 'O comentário não pode ficar vazio' })
  }
  if (trimmed.length > COMMENT_MAX_LENGTH) {
    throw createError({ statusCode: 400, message: `O comentário pode ter no máximo ${COMMENT_MAX_LENGTH} caracteres` })
  }
  return trimmed
}

export const CommentService = {
  // Alvo em DRAFT (ou inexistente) não expõe comentários, mesmo os que
  // ficaram VISIBLE antes de ele ser despublicado.
  async getVisible(target: CommentTargetRef) {
    if (!await isPublishedTarget(target)) {
      return []
    }
    return db.query.comments.findMany({
      with: {
        ...withRelations,
        replies: {
          with: withRelations,
          where: (r, { eq }) => eq(r.status, 'VISIBLE'),
          orderBy: (r, { asc }) => [asc(r.createdAt)]
        }
      },
      where: (c, { and, eq, isNull }) => and(targetFilter(c, target), eq(c.status, 'VISIBLE'), isNull(c.parentId)),
      orderBy: (c, { asc }) => [asc(c.createdAt)]
    })
  },

  // Conta comentários VISIBLE (raiz + respostas) — usado nas listagens
  // públicas, não precisa da árvore inteira pra isso.
  async countVisible(target: CommentTargetRef) {
    const [row] = await db
      .select({ value: count() })
      .from(comments)
      .where(and(targetFilter(comments, target), eq(comments.status, 'VISIBLE')))
    return row?.value ?? 0
  },

  async getPending() {
    return CommentService.getByStatus('PENDING')
  },

  // Admin: todos os comentários com o status informado, de qualquer alvo
  // (seção 15 — admin visualiza pendentes, publicados e ocultos).
  async getByStatus(status: CommentStatus) {
    return db.query.comments.findMany({
      with: withRelations,
      where: (c, { eq }) => eq(c.status, status),
      orderBy: (c, { desc }) => [desc(c.createdAt)]
    })
  },

  async getReplies(parentId: string) {
    return db.query.comments.findMany({
      with: withRelations,
      where: (c, { eq }) => eq(c.parentId, parentId),
      orderBy: (c, { asc }) => [asc(c.createdAt)]
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
    const content = normalizeContent(input.content)

    // Só se comenta em conteúdo publicado (seção 15). Mesma resposta para
    // inexistente e DRAFT — não revela rascunhos.
    if (!await isPublishedTarget(input.target)) {
      throw createError({ statusCode: 404, message: 'Conteúdo não encontrado' })
    }

    if (input.parentId) {
      const parent = UUID_PATTERN.test(input.parentId)
        ? await db.query.comments.findFirst({ where: (c, { eq }) => eq(c.id, input.parentId!) })
        : undefined
      if (!parent) {
        throw createError({ statusCode: 404, message: 'Comentário pai não encontrado' })
      }
      if (!isSameTarget(parent, input.target)) {
        throw createError({ statusCode: 400, message: 'A resposta precisa estar no mesmo conteúdo do comentário pai' })
      }
      if (parent.parentId) {
        throw createError({ statusCode: 400, message: 'Respostas só podem ter um nível de profundidade' })
      }
    }

    const [comment] = await db
      .insert(comments)
      .values({
        content,
        ...targetValues(input.target),
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
