import { expect, test } from '@playwright/test'
import { gotoAndWaitReady, loginAs } from './helpers'

// Fluxo prioritário da seção 33: admin login → criar projeto → DRAFT →
// publicar → aparece publicamente.
test.describe('Fluxo de projeto (E2E)', () => {
  test('admin cria, publica, e o projeto passa a aparecer publicamente', async ({ page, request }) => {
    const suffix = Date.now()
    const title = `Projeto E2E ${suffix}`
    const slug = `projeto-e2e-${suffix}`

    await loginAs(page, 'admin@portfolio-cms.dev', 'admin12345')

    await gotoAndWaitReady(page, '/admin/projetos/novo')
    await page.getByLabel('Título').fill(title)
    await page.getByLabel('Descrição curta').fill('Descrição curta de teste E2E')
    await page.getByLabel('Descrição completa').fill('Descrição completa de teste E2E')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page).toHaveURL(/\/admin\/projetos\/.+\/editar/)

    // ainda DRAFT: chamador não-autenticado (fixture `request`, sem cookies
    // do admin logado em `page`) não deve conseguir ver o projeto. Não
    // testamos isso navegando com `page` porque o admin logado enxerga
    // rascunhos até na página pública, por design (seção 11).
    const draftCheck = await request.post('/api/graphql', {
      data: { query: 'query ($slug: String!) { project(slug: $slug) { id } }', variables: { slug } }
    })
    const { data: draftData } = await draftCheck.json()
    expect(draftData.project).toBeNull()

    // publica
    await gotoAndWaitReady(page, '/admin/projetos')
    const projectRow = page.getByRole('row', { name: new RegExp(title) })
    await projectRow.getByRole('button', { name: 'Publicar' }).click()
    await expect(projectRow.getByRole('button', { name: 'Despublicar' })).toBeVisible()

    // aparece publicamente
    await gotoAndWaitReady(page, `/projetos/${slug}`)
    await expect(page.getByRole('heading', { name: title })).toBeVisible()

    await gotoAndWaitReady(page, '/projetos')
    await expect(page.getByText(title)).toBeVisible()

    // limpeza
    const loginResponse = await request.post('/api/auth/login', {
      data: { email: 'admin@portfolio-cms.dev', password: 'admin12345' }
    })
    expect(loginResponse.ok()).toBe(true)
    const listResult = await request.post('/api/graphql', {
      data: { query: '{ projects { id slug } }' }
    })
    const { data: listData } = await listResult.json()
    const created = listData.projects.find((p: { slug: string }) => p.slug === slug)
    if (created) {
      await request.post('/api/graphql', {
        data: { query: 'mutation ($id: ID!) { deleteProject(id: $id) }', variables: { id: created.id } }
      })
    }
  })
})
