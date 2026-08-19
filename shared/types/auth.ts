export type UserRole = 'USER' | 'ADMIN'

export interface SessionUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string | null
  bio?: string | null
}
