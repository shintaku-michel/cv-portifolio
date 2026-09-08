export type CertificateCategory =
  | 'DESENVOLVIMENTO_WEB'
  | 'UX_UI_DESIGN'
  | 'DEVOPS'
  | 'BACKEND'
  | 'GESTAO_DE_PROJETOS'

export interface Certificate {
  id: string
  title: string
  description: string
  category: CertificateCategory
  completedAt: string
  image: string | null
  onlineUrl: string | null
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface CertificateInput {
  title: string
  description: string
  category: CertificateCategory
  completedAt: string
  image?: string | null
  onlineUrl?: string | null
  displayOrder?: number
}
