import type { SessionUser } from './auth'
import type { ContentRef, ContentType } from './content'

export type CommentStatus = 'PENDING' | 'VISIBLE' | 'HIDDEN'

/** Onde o comentário foi feito. Novo alvo = novo valor em ContentType + coluna no banco. */
export type CommentTargetType = ContentType

export type CommentTargetRef = ContentRef

export interface CommentTarget extends CommentTargetRef {
  title: string
  slug: string
  /** Página pública do alvo (ex: `/posts/meu-post`, `/projetos/meu-projeto`). */
  url: string
}

export interface Comment {
  id: string
  content: string
  user: SessionUser
  target: CommentTarget
  parentId: string | null
  status: CommentStatus
  replies: Comment[]
  createdAt: string
  updatedAt: string
}
