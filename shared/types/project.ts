export type ProjectStatus = 'DRAFT' | 'PUBLISHED'

export interface Technology {
  id: string
  name: string
  slug: string
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
  displayOrder?: number
  technologyIds?: string[]
}
