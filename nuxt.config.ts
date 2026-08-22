import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Portfolio CMS',
      titleTemplate: '%s · Portfolio CMS',
      script: [
        {
          // Aplica o tema salvo ao <html> antes da hidratação, evitando
          // flash de tema claro seguido de escuro (ou vice-versa).
          innerHTML: `(function(){try{var t=localStorage.getItem('portfolio-cms:theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})();`,
          type: 'text/javascript'
        }
      ]
    }
  },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/tailwind.css'],
  components: [
    // Componentes shadcn-vue (components/ui) usam import explícito via
    // alias `@/components/ui/*`, não auto-import global do Nuxt.
    { path: '~/components', pathPrefix: false, ignore: ['**/ui/**'] }
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  nitro: {
    // Empacota server/graphql/schema/*.graphql no build de produção
    // (readFileSync direto não é garantido pelo bundler do Nitro).
    // Caminho absoluto: o `dir` de serverAssets é resolvido a partir do
    // srcDir do Nitro (já é `server/`), não da raiz do projeto.
    serverAssets: [{ baseName: 'graphql', dir: fileURLToPath(new URL('./server/graphql/schema', import.meta.url)) }]
  }
})