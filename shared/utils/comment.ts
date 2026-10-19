import type { CommentTargetType } from '../types/comment'

/** Tamanho máximo do comentário — validado no servidor e limitado no campo. */
export const COMMENT_MAX_LENGTH = 2000

export const COMMENT_TARGET_LABELS: Record<CommentTargetType, string> = {
  POST: 'Post',
  PROJECT: 'Projeto'
}
