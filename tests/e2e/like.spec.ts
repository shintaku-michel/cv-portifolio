import { expect, test } from '@playwright/test'
import { gotoAndWaitReady, loginAs } from './helpers'

// Fluxo prioritário da seção 33: user login → abrir post → curtir →
// like aparece → descurtir → like desaparece.
test.describe('Fluxo de like (E2E)', () => {
  test('curtir incrementa e descurtir decrementa a contagem', async ({ page, request }) => {
    const suffix = Date.now()
    const slug = `post-like-e2e-${suffix}`

    // setup: admin cria e publica um post via API (não é o alvo deste teste)
    await request.post('/api/auth/login', {
      data: { email: 'admin@portfolio-cms.dev', password: 'admin12345' }
    })
    const createResult = await request.post('/api/graphql', {
      data: {
        query: 'mutation ($input: CreatePostInput!) { createPost(input: $input) { id } }',
        variables: { input: { title: `Post p/ Like E2E ${suffix}`, slug, excerpt: 'x', content: 'y' } }
      }
    })
    const { data: createData } = await createResult.json()
    const postId: string = createData.createPost.id
    await request.post('/api/graphql', {
      data: { query: 'mutation ($id: ID!) { publishPost(id: $id) { id } }', variables: { id: postId } }
    })

    await loginAs(page, 'leitor@portfolio-cms.dev', 'leitor12345')

    await gotoAndWaitReady(page, `/posts/${slug}`)

    const likeButton = page.getByRole('button', { name: /Curtir/ })
    await expect(likeButton).toHaveText('0')

    await likeButton.click()
    await expect(page.getByRole('button', { name: /Descurtir/ })).toHaveText('1')

    await page.getByRole('button', { name: /Descurtir/ }).click()
    await expect(page.getByRole('button', { name: /Curtir/ })).toHaveText('0')

    // limpeza
    await request.post('/api/graphql', {
      data: { query: 'mutation ($id: ID!) { deletePost(id: $id) }', variables: { id: postId } }
    })
  })
})
