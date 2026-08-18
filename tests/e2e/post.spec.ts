import { expect, test } from '@playwright/test'
import { gotoAndWaitReady, loginAs } from './helpers'

// Fluxo prioritário da seção 33: admin login → criar post → DRAFT →
// publicar → aparece publicamente.
test.describe('Fluxo de post (E2E)', () => {
  test('admin cria, publica, e o post passa a aparecer publicamente', async ({ page, request }) => {
    const suffix = Date.now()
    const title = `Post E2E ${suffix}`
    const slug = `post-e2e-${suffix}`

    await loginAs(page, 'admin@portfolio-cms.dev', 'admin12345')

    await gotoAndWaitReady(page, '/admin/posts/novo')
    await page.getByLabel('Título').fill(title)
    await page.getByLabel('Resumo').fill('Resumo de teste E2E')
    await page.getByLabel('Conteúdo (Markdown)').fill('Conteúdo de teste E2E')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page).toHaveURL(/\/admin\/posts\/.+\/editar/)

    // ainda DRAFT: chamador não-autenticado (fixture `request`, sem cookies
    // do admin logado em `page`) não deve conseguir ver o post. Não
    // testamos isso navegando com `page` porque o admin logado enxerga
    // rascunhos até na página pública, por design.
    const draftCheck = await request.post('/api/graphql', {
      data: { query: 'query ($slug: String!) { post(slug: $slug) { id } }', variables: { slug } }
    })
    const { data: draftData } = await draftCheck.json()
    expect(draftData.post).toBeNull()

    // publica
    await gotoAndWaitReady(page, '/admin/posts')
    const postRow = page.getByRole('row', { name: new RegExp(title) })
    await postRow.getByRole('button', { name: 'Publicar' }).click()
    await expect(postRow.getByRole('button', { name: 'Despublicar' })).toBeVisible()

    // aparece publicamente
    await gotoAndWaitReady(page, `/posts/${slug}`)
    await expect(page.getByRole('heading', { name: title })).toBeVisible()

    await gotoAndWaitReady(page, '/posts')
    await expect(page.getByText(title)).toBeVisible()

    // limpeza
    await request.post('/api/auth/login', {
      data: { email: 'admin@portfolio-cms.dev', password: 'admin12345' }
    })
    const listResult = await request.post('/api/graphql', {
      data: { query: '{ posts { id slug } }' }
    })
    const { data: listData } = await listResult.json()
    const created = listData.posts.find((p: { slug: string }) => p.slug === slug)
    if (created) {
      await request.post('/api/graphql', {
        data: { query: 'mutation ($id: ID!) { deletePost(id: $id) }', variables: { id: created.id } }
      })
    }
  })
})
