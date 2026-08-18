import { expect, test } from '@playwright/test'
import { gotoAndWaitReady, loginAs } from './helpers'

// Fluxo prioritário da seção 33: user login → abrir post → criar
// comentário → PENDING → não aparece publicamente → admin aprova →
// aparece publicamente.
test.describe('Fluxo de comentário (E2E)', () => {
  test('comentário fica pendente até um admin aprovar', async ({ page, request }) => {
    const suffix = Date.now()
    const slug = `post-comentario-e2e-${suffix}`
    const commentText = `Comentário E2E ${suffix}`

    // setup: admin cria e publica um post via API (não é o alvo deste teste)
    await request.post('/api/auth/login', {
      data: { email: 'admin@portfolio-cms.dev', password: 'admin12345' }
    })
    const createResult = await request.post('/api/graphql', {
      data: {
        query: 'mutation ($input: CreatePostInput!) { createPost(input: $input) { id } }',
        variables: { input: { title: `Post base E2E ${suffix}`, slug, excerpt: 'x', content: 'y' } }
      }
    })
    const { data: createData } = await createResult.json()
    const postId: string = createData.createPost.id
    await request.post('/api/graphql', {
      data: { query: 'mutation ($id: ID!) { publishPost(id: $id) { id } }', variables: { id: postId } }
    })

    await loginAs(page, 'leitor@portfolio-cms.dev', 'leitor12345')

    // abre o post e comenta
    await gotoAndWaitReady(page, `/posts/${slug}`)
    await page.getByLabel('Comentário').fill(commentText)
    await page.getByRole('button', { name: 'Comentar' }).click()
    await expect(page.getByText('aparece publicamente após aprovação')).toBeVisible()

    // recarrega — comentário PENDING não aparece publicamente
    await gotoAndWaitReady(page, `/posts/${slug}`)
    await expect(page.getByText(commentText)).not.toBeVisible()

    // admin aprova via API
    const pendingResult = await request.post('/api/graphql', {
      data: { query: '{ adminComments(status: PENDING) { id content } }' }
    })
    const { data: pendingData } = await pendingResult.json()
    const comment = pendingData.adminComments.find((c: { content: string }) => c.content === commentText)
    expect(comment).toBeTruthy()
    await request.post('/api/graphql', {
      data: { query: 'mutation ($id: ID!) { approveComment(id: $id) { id } }', variables: { id: comment.id } }
    })

    // recarrega — comentário aprovado aparece publicamente
    await gotoAndWaitReady(page, `/posts/${slug}`)
    await expect(page.getByText(commentText)).toBeVisible()

    // limpeza (cascade remove o comentário junto)
    await request.post('/api/graphql', {
      data: { query: 'mutation ($id: ID!) { deletePost(id: $id) }', variables: { id: postId } }
    })
  })
})
