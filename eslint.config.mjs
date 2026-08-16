// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    // Componentes base do shadcn-vue são gerados via CLI e não devem ser
    // editados manualmente (seção 29 do CLAUDE.md).
    ignores: ['app/components/ui/**']
  }
)
