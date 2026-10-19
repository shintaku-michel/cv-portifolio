import { eq } from 'drizzle-orm'
import type { ContentRef } from '../../shared/types/content'
import { db } from '../database/client'
import { posts, projects } from '../database/schema'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value)
}

// Só conteúdo PUBLISHED recebe interação (comentário, curtida) ou expõe as
// já existentes. Id inválido conta como inexistente em vez de virar erro 500.
export async function isPublishedContent(ref: ContentRef): Promise<boolean> {
  if (!isUuid(ref.id)) {
    return false
  }
  const [row] = ref.type === 'POST'
    ? await db.select({ status: posts.status }).from(posts).where(eq(posts.id, ref.id)).limit(1)
    : await db.select({ status: projects.status }).from(projects).where(eq(projects.id, ref.id)).limit(1)
  return row?.status === 'PUBLISHED'
}
