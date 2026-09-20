import type { Component } from 'vue'

// Catálogo estático dos componentes de playground, resolvido em build-time —
// nenhuma string vinda do banco chega perto de um import dinâmico. A chave
// salva no projeto (Project.playgroundComponent) é o nome da pasta; cada
// pasta segue o mesmo padrão de barrel de `components/ui/*` (ex:
// `playground/button/index.ts` → `export { default as Button } from './Button.vue'`).
const modules = import.meta.glob('../components/playground/*/index.ts', { eager: true }) as Record<string, Record<string, unknown>>

function toPascalCase(folderName: string) {
  return folderName
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

export const PLAYGROUND_COMPONENTS: Record<string, Component> = {}

for (const path in modules) {
  const folder = path.match(/playground\/([^/]+)\/index\.ts$/)?.[1]
  if (!folder) continue

  const exportName = toPascalCase(folder)
  const component = modules[path]?.[exportName]
  if (component) {
    PLAYGROUND_COMPONENTS[folder] = component as Component
  }
}

export const PLAYGROUND_COMPONENT_KEYS = Object.keys(PLAYGROUND_COMPONENTS).sort()
