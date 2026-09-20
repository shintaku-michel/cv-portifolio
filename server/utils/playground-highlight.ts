import { codeToHtml } from 'shiki'

// Lê via serverAssets (registrado em nuxt.config.ts) em vez de
// import.meta.glob/readFileSync direto — só assim os arquivos ficam
// garantidamente embutidos no build de produção do Nitro (mesmo motivo do
// schema GraphQL em server/graphql/schema/index.ts).
function toPascalCase(folderName: string) {
  return folderName
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

// Em dev o asset driver (fs) retorna string; no build de produção os
// server assets são embutidos como bytes (Uint8Array), por isso decodifica.
function toText(value: unknown): string {
  if (typeof value === 'string') return value
  if (value instanceof Uint8Array) return new TextDecoder().decode(value)
  throw new TypeError('Formato inesperado para asset de componente de playground')
}

const highlightedCache = new Map<string, string>()

export async function getHighlightedPlaygroundSource(componentKey: string): Promise<string | null> {
  const storage = useStorage('assets:playground')
  const raw = await storage.getItem<string | Uint8Array>(`${componentKey}:${toPascalCase(componentKey)}.vue`)
  if (!raw) return null

  const cached = highlightedCache.get(componentKey)
  if (cached) return cached

  const html = await codeToHtml(toText(raw), { lang: 'vue', theme: 'github-dark-default' })
  highlightedCache.set(componentKey, html)
  return html
}
