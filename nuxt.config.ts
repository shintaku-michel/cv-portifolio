import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  runtimeConfig: {
    // DATABASE_URL (via .env) é a única fonte de verdade — usada tanto
    // pelo drizzle-kit (CLI) quanto pela app em runtime.
    databaseUrl: process.env.DATABASE_URL
  },
  css: ['~/assets/css/tailwind.css'],
  components: [
    // Componentes shadcn-vue (components/ui) usam import explícito via
    // alias `@/components/ui/*`, não auto-import global do Nuxt.
    { path: '~/components', pathPrefix: false, ignore: ['**/ui/**'] }
  ],
  vite: {
    plugins: [tailwindcss()]
  }
})