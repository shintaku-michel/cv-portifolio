import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    // specs do Playwright (tests/e2e) usam um runner próprio, não o Vitest.
    exclude: ['**/node_modules/**', '**/tests/e2e/**']
  }
})
