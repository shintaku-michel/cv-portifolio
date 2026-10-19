/** Conteúdo público que recebe interação dos usuários (comentários, curtidas). */
export type ContentType = 'POST' | 'PROJECT'

export interface ContentRef {
  type: ContentType
  id: string
}
