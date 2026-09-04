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
          // flash de tema claro seguido de escuro (ou vice-versa). Padrão é
          // escuro — só fica claro se o usuário escolheu isso explicitamente.
          innerHTML: `(function(){try{var t=localStorage.getItem('portfolio-cms:theme');if(t!=='light')document.documentElement.classList.add('dark')}catch(e){}})();`,
          type: 'text/javascript'
        }
      ]
    }
  },
  modules: ['@nuxt/eslint', '@nuxt/fonts'],
  // Fontes (Inter, Caveat) são referenciadas via `--font-*` em tailwind.css;
  // o módulo detecta o uso e as auto-hospeda no domínio do projeto, para que
  // todo visitante receba exatamente o mesmo arquivo, sem depender do Google
  // Fonts estar acessível na rede de quem acessa.
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Caveat', provider: 'google' }
    ]
  },
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