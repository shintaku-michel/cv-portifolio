import { defineConfig, devices } from '@playwright/test'

// E2E precisa do Postgres local rodando (`npm run db:up`) e do seed
// aplicado (`npm run db:seed`) — usa as contas admin@/leitor@portfolio-cms.dev.
//
// Usamos o Playwright puro (webServer) em vez do fixture `nuxt:` do
// @nuxt/test-utils/playwright: esse fixture chama internamente
// @nuxt/kit's loadNuxt(), que nesta combinação de versões (Nuxt 4.5,
// Vue 3.5.41, Node 22) quebra com "shared.makeMap is not a function"
// ao carregar o CJS do Vue dentro do processo worker do Playwright —
// bug de interop CJS/ESM na cadeia de dependências, não do nosso código
// (reproduzido isoladamente: loadNuxt() funciona normalmente fora do
// Playwright). Controlar o servidor nós mesmos evita esse caminho.
const PORT = 3458

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`
  },
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
})
