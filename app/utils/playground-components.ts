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

// Fonte crua do arquivo .vue principal de cada pasta (ex: playground/card/Card.vue)
// — usada pra mostrar/copiar o código no post, igual a página de docs do
// shadcn. `?raw` faz o Vite importar o conteúdo do arquivo como string, sem
// compilar — não é o mesmo módulo usado em PLAYGROUND_COMPONENTS acima.
const sourceModules = import.meta.glob('../components/playground/*/*.vue', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

export const PLAYGROUND_SOURCES: Record<string, string> = {}

for (const path in sourceModules) {
  const match = path.match(/playground\/([^/]+)\/([^/]+)\.vue$/)
  if (!match) continue

  const [, folder, fileName] = match
  if (fileName === toPascalCase(folder!)) {
    PLAYGROUND_SOURCES[folder!] = sourceModules[path]!
  }
}

// Detecta quais primitivos de @/components/ui/* o componente importa, pra
// listar como dependência (o dev que for reusar o código precisa copiar
// esses arquivos também — eles não vêm junto no "copiar código").
export function getPlaygroundDependencies(componentKey: string): string[] {
  const source = PLAYGROUND_SOURCES[componentKey]
  if (!source) return []

  const matches = source.matchAll(/@\/components\/ui\/([a-z-]+)/g)
  return [...new Set([...matches].map(m => m[1]!))].sort()
}

// Detecta se o componente importa ícones do @lucide/vue, pra avisar que
// esse pacote também precisa ser instalado (não é um primitivo shadcn-vue,
// então não aparece em getPlaygroundDependencies acima).
export function usesLucideIcons(componentKey: string): boolean {
  const source = PLAYGROUND_SOURCES[componentKey]
  return source ? /@lucide\/vue/.test(source) : false
}
