export type ProjectStatus = 'DRAFT' | 'PUBLISHED'

export type TechnologyCategory =
  | 'FRONTEND'
  | 'BACKEND'
  | 'API'
  | 'DATABASE'
  | 'ORM'
  | 'CLOUD'
  | 'DEVOPS'
  | 'BUILD_TOOLS'
  | 'TESTING'
  | 'AI'
  | 'SECURITY'
  | 'PAYMENTS'
  | 'ARCHITECTURE'
  | 'INFRASTRUCTURE'
  | 'VERSION_CONTROL'
  | 'OBSERVABILITY'

export interface Technology {
  id: string
  name: string
  slug: string
  category: TechnologyCategory
}

export interface Project {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  coverImage: string | null
  gallery: string[]
  status: ProjectStatus
  featured: boolean
  isOnline: boolean
  displayOrder: number
  demoUrl: string | null
  repositoryUrl: string | null
  startDate: string | null
  endDate: string | null
  technologies: Technology[]
  createdAt: string
  updatedAt: string
}

export interface ProjectInput {
  title: string
  slug: string
  shortDescription: string
  description: string
  coverImage?: string | null
  gallery?: string[]
  demoUrl?: string | null
  repositoryUrl?: string | null
  startDate?: string | null
  endDate?: string | null
  featured?: boolean
  isOnline?: boolean
  displayOrder?: number
  technologyIds?: string[]
}
