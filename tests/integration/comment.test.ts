import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { db } from '../../server/database/client'
import { posts, users } from '../../server/database/schema'
import { CommentService } from '../../server/services/comment.service'

const suffix = randomUUID().slice(0, 8)
const userEmail = `test-comment-user-${suffix}@example.com`

let userId: string
let postId: string

describe('CommentService (integração)', () => {
  beforeAll(async () => {
    const [user] = await db
      .insert(users)
      .values({ name: 'Comentarista', email: userEmail, passwordHash: 'scrypt:1:1:1:aa:bb', role: 'USER' })
      .returning()
    userId = user!.id

    const [post] = await db
      .insert(posts)
      .values({
        title: 'Post para Comentários',
        slug: `post-comentarios-${suffix}`,
        excerpt: 'x',
        content: 'y',
        authorId: userId,
        status: 'PUBLISHED'
      })
      .returning()
    postId = post!.id
  })

  afterAll(async () => {
    await db.delete(posts).where(eq(posts.id, postId))
    await db.delete(users).where(eq(users.id, userId))
    await db.$client.end()
  })

  it('createComment sempre inicia como PENDING, mesmo se tentarem enviar outro status', async () => {
    const comment = await CommentService.create(userId, { postId, content: 'Primeiro comentário' })
    expect(comment?.status).toBe('PENDING')
  })

  it('comments(postId) não retorna comentários PENDING', async () => {
    const visible = await CommentService.getVisible(postId)
    expect(visible).toHaveLength(0)
  })

  it('approveComment torna o comentário visível na listagem pública', async () => {
    const pending = await CommentService.getPending()
    const target = pending.find(c => c.postId === postId)!
    await CommentService.approve(target.id)

    const visible = await CommentService.getVisible(postId)
    expect(visible.some(c => c.id === target.id)).toBe(true)
  })

  it('permite uma resposta de 1º nível', async () => {
    const [parent] = await CommentService.getVisible(postId)
    const reply = await CommentService.create(userId, {
      postId,
      content: 'Resposta',
      parentId: parent!.id
    })
    expect(reply?.parentId).toBe(parent!.id)
  })

  it('rejeita resposta a uma resposta (profundidade > 1)', async () => {
    const [parent] = await CommentService.getVisible(postId)
    const [reply] = await CommentService.getPending().then(rows => rows.filter(c => c.parentId === parent!.id))

    await expect(
      CommentService.create(userId, { postId, content: 'Resposta da resposta', parentId: reply!.id })
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('hideComment remove o comentário da listagem pública', async () => {
    const [visible] = await CommentService.getVisible(postId)
    await CommentService.hide(visible!.id)

    const afterHide = await CommentService.getVisible(postId)
    expect(afterHide.some(c => c.id === visible!.id)).toBe(false)
  })
})
