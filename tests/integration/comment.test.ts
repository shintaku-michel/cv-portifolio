import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { CommentTargetRef } from '../../shared/types/comment'
import { db } from '../../server/database/client'
import { comments, posts, projects, users } from '../../server/database/schema'
import { COMMENT_MAX_LENGTH, CommentService } from '../../server/services/comment.service'

const suffix = randomUUID().slice(0, 8)
const userEmail = `test-comment-user-${suffix}@example.com`

let userId: string
let postId: string
let draftPostId: string
let projectId: string
let draftProjectId: string
let post: CommentTargetRef
let project: CommentTargetRef

describe('CommentService (integração)', () => {
  beforeAll(async () => {
    const [user] = await db
      .insert(users)
      .values({ name: 'Comentarista', email: userEmail, passwordHash: 'scrypt:1:1:1:aa:bb', role: 'USER' })
      .returning()
    userId = user!.id

    const [published, draft] = await db
      .insert(posts)
      .values([
        { title: 'Post para Comentários', slug: `post-comentarios-${suffix}`, excerpt: 'x', content: 'y', authorId: userId, status: 'PUBLISHED' },
        { title: 'Post Rascunho', slug: `post-rascunho-${suffix}`, excerpt: 'x', content: 'y', authorId: userId, status: 'DRAFT' }
      ])
      .returning()
    postId = published!.id
    draftPostId = draft!.id
    post = { type: 'POST', id: postId }

    const [publishedProject, draftProject] = await db
      .insert(projects)
      .values([
        { title: 'Componente para Comentários', slug: `componente-comentarios-${suffix}`, shortDescription: 'x', description: 'y', status: 'PUBLISHED' },
        { title: 'Componente Rascunho', slug: `componente-rascunho-${suffix}`, shortDescription: 'x', description: 'y', status: 'DRAFT' }
      ])
      .returning()
    projectId = publishedProject!.id
    draftProjectId = draftProject!.id
    project = { type: 'PROJECT', id: projectId }
  })

  afterAll(async () => {
    await db.delete(posts).where(eq(posts.id, postId))
    await db.delete(posts).where(eq(posts.id, draftPostId))
    await db.delete(projects).where(eq(projects.id, projectId))
    await db.delete(projects).where(eq(projects.id, draftProjectId))
    await db.delete(users).where(eq(users.id, userId))
    await db.$client.end()
  })

  describe('em posts', () => {
    it('createComment sempre inicia como PENDING, mesmo se tentarem enviar outro status', async () => {
      const comment = await CommentService.create(userId, { target: post, content: 'Primeiro comentário' })
      expect(comment?.status).toBe('PENDING')
    })

    it('comments(target) não retorna comentários PENDING', async () => {
      const visible = await CommentService.getVisible(post)
      expect(visible).toHaveLength(0)
    })

    it('approveComment torna o comentário visível na listagem pública', async () => {
      const pending = await CommentService.getPending()
      const target = pending.find(c => c.postId === postId)!
      await CommentService.approve(target.id)

      const visible = await CommentService.getVisible(post)
      expect(visible.some(c => c.id === target.id)).toBe(true)
    })

    it('permite uma resposta de 1º nível', async () => {
      const [parent] = await CommentService.getVisible(post)
      const reply = await CommentService.create(userId, { target: post, content: 'Resposta', parentId: parent!.id })
      expect(reply?.parentId).toBe(parent!.id)
    })

    it('rejeita resposta a uma resposta (profundidade > 1)', async () => {
      const [parent] = await CommentService.getVisible(post)
      const [reply] = await CommentService.getPending().then(rows => rows.filter(c => c.parentId === parent!.id))

      await expect(
        CommentService.create(userId, { target: post, content: 'Resposta da resposta', parentId: reply!.id })
      ).rejects.toMatchObject({ statusCode: 400 })
    })

    it('hideComment remove o comentário da listagem pública', async () => {
      const [visible] = await CommentService.getVisible(post)
      await CommentService.hide(visible!.id)

      const afterHide = await CommentService.getVisible(post)
      expect(afterHide.some(c => c.id === visible!.id)).toBe(false)
    })

    it('getByStatus (admin) lista comentários pelo status, com o post anexado', async () => {
      const hidden = await CommentService.getByStatus('HIDDEN')
      const found = hidden.find(c => c.postId === postId)

      expect(found).toBeDefined()
      expect(found!.post?.id).toBe(postId)
    })

    it('countVisible conta só comentários VISIBLE (raiz + respostas), não PENDING/HIDDEN', async () => {
      const before = await CommentService.countVisible(post)

      const pending = await CommentService.create(userId, { target: post, content: 'Ainda pendente' })
      expect(await CommentService.countVisible(post)).toBe(before)

      await CommentService.approve(pending!.id)
      expect(await CommentService.countVisible(post)).toBe(before + 1)

      const reply = await CommentService.create(userId, { target: post, content: 'Resposta', parentId: pending!.id })
      await CommentService.approve(reply!.id)
      expect(await CommentService.countVisible(post)).toBe(before + 2)

      await CommentService.hide(pending!.id)
      expect(await CommentService.countVisible(post)).toBe(before + 1)
    })
  })

  describe('em projetos/componentes', () => {
    it('cria, aprova e lista comentários do projeto, isolados dos do post', async () => {
      const created = await CommentService.create(userId, { target: project, content: 'Comentário no componente' })
      expect(created?.projectId).toBe(projectId)
      expect(created?.postId).toBeNull()

      await CommentService.approve(created!.id)

      const visible = await CommentService.getVisible(project)
      expect(visible.map(c => c.id)).toEqual([created!.id])
      expect(await CommentService.countVisible(project)).toBe(1)

      const onPost = await CommentService.getVisible(post)
      expect(onPost.some(c => c.id === created!.id)).toBe(false)
    })

    it('getByStatus anexa o projeto ao comentário', async () => {
      const visible = await CommentService.getByStatus('VISIBLE')
      const found = visible.find(c => c.projectId === projectId)

      expect(found!.project?.id).toBe(projectId)
      expect(found!.post).toBeNull()
    })
  })

  describe('validações', () => {
    it('rejeita comentário em post DRAFT com 404 (não revela o rascunho)', async () => {
      await expect(
        CommentService.create(userId, { target: { type: 'POST', id: draftPostId }, content: 'Oi' })
      ).rejects.toMatchObject({ statusCode: 404 })
    })

    it('rejeita comentário em projeto DRAFT com 404', async () => {
      await expect(
        CommentService.create(userId, { target: { type: 'PROJECT', id: draftProjectId }, content: 'Oi' })
      ).rejects.toMatchObject({ statusCode: 404 })
    })

    it('rejeita alvo inexistente ou com id inválido com 404', async () => {
      await expect(
        CommentService.create(userId, { target: { type: 'POST', id: randomUUID() }, content: 'Oi' })
      ).rejects.toMatchObject({ statusCode: 404 })
      await expect(
        CommentService.create(userId, { target: { type: 'PROJECT', id: 'nao-e-uuid' }, content: 'Oi' })
      ).rejects.toMatchObject({ statusCode: 404 })
    })

    it('não expõe comentários de um alvo despublicado', async () => {
      await db.update(projects).set({ status: 'DRAFT' }).where(eq(projects.id, projectId))
      expect(await CommentService.getVisible(project)).toEqual([])
      await db.update(projects).set({ status: 'PUBLISHED' }).where(eq(projects.id, projectId))
    })

    it('rejeita resposta cujo pai está em outro alvo', async () => {
      const [parentOnProject] = await CommentService.getVisible(project)

      await expect(
        CommentService.create(userId, { target: post, content: 'Resposta cruzada', parentId: parentOnProject!.id })
      ).rejects.toMatchObject({ statusCode: 400 })
    })

    it('remove espaços nas pontas e rejeita conteúdo vazio ou longo demais', async () => {
      const created = await CommentService.create(userId, { target: post, content: '  com espaços  ' })
      expect(created?.content).toBe('com espaços')

      await expect(CommentService.create(userId, { target: post, content: '   ' })).rejects.toMatchObject({ statusCode: 400 })
      await expect(
        CommentService.create(userId, { target: post, content: 'a'.repeat(COMMENT_MAX_LENGTH + 1) })
      ).rejects.toMatchObject({ statusCode: 400 })
    })

    it('o banco exige exatamente um alvo por comentário', async () => {
      await expect(
        db.insert(comments).values({ content: 'Sem alvo', userId })
      ).rejects.toThrow()
      await expect(
        db.insert(comments).values({ content: 'Dois alvos', userId, postId, projectId })
      ).rejects.toThrow()
    })
  })
})
