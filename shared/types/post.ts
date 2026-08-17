import type { SessionUser } from './auth'

export type PostStatus = 'DRAFT' | 'PUBLISHED'

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  status: PostStatus
  author: SessionUser
  category: Category | null
  tags: Tag[]
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PostInput {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  categoryId?: string | null
  tagIds?: string[]
}
