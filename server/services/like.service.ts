import { and, count, eq } from 'drizzle-orm'
import { createError } from 'h3'
import type { ContentRef } from '../../shared/types/content'
import { db } from '../database/client'
import { likes } from '../database/schema'
import { isPublishedContent } from '../utils/content'

// Coluna de `likes` de cada tipo de conteúdo. Novo alvo = nova entrada aqui
// (+ coluna, unique e CHECK no schema).
const TARGET_COLUMNS = {
  POST: likes.postId,
  PROJECT: likes.projectId
} as const

function targetFilter(target: ContentRef) {
  return eq(TARGET_COLUMNS[target.type], target.id)
}

export const LikeService = {
  async countFor(target: ContentRef) {
    const [row] = await db.select({ value: count() }).from(likes).where(targetFilter(target))
    return row?.value ?? 0
  },

  async isLikedBy(target: ContentRef, userId: string) {
    const [row] = await db
      .select({ id: likes.id })
      .from(likes)
      .where(and(targetFilter(target), eq(likes.userId, userId)))
      .limit(1)
    return Boolean(row)
  },

  // Só conteúdo PUBLISHED pode ser curtido — sem isso, o retorno da mutation
  // vazaria um rascunho. Mesma resposta para inexistente e DRAFT.
  async assertLikeable(target: ContentRef) {
    if (!await isPublishedContent(target)) {
      throw createError({ statusCode: 404, message: 'Conteúdo não encontrado' })
    }
  },

  async like(target: ContentRef, userId: string) {
    await LikeService.assertLikeable(target)
    const column = target.type === 'POST' ? { postId: target.id } : { projectId: target.id }
    await db.insert(likes).values({ ...column, userId }).onConflictDoNothing()
  },

  async unlike(target: ContentRef, userId: string) {
    await LikeService.assertLikeable(target)
    await db.delete(likes).where(and(targetFilter(target), eq(likes.userId, userId)))
  }
}
