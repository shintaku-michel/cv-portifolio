import type { SessionUser } from './auth'

export type CommentStatus = 'PENDING' | 'VISIBLE' | 'HIDDEN'

export interface Comment {
  id: string
  content: string
  user: SessionUser
  post: { id: string, title: string, slug: string }
  postId: string
  parentId: string | null
  status: CommentStatus
  createdAt: string
  updatedAt: string
}
