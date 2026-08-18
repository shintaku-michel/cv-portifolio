import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

// page.goto() só espera o evento `load` (HTML do SSR já visível), não a
// hidratação do Vue terminar — clicar/preencher cedo demais interage com
// elementos sem os handlers ainda conectados. `networkidle` é um proxy
// razoável (o bundle client já foi buscado e executado) já que não usamos
// o fixture `goto` do @nuxt/test-utils/playwright (ver playwright.config.ts).
export async function gotoAndWaitReady(page: Page, url: string) {
  await page.goto(url)
  await page.waitForLoadState('networkidle')
}

export async function loginAs(page: Page, email: string, password: string) {
  await gotoAndWaitReady(page, '/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Senha').fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByText('Autenticado como')).toBeVisible()
}
