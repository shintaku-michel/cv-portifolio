import { codeToHtml } from 'shiki'

// Lê via serverAssets (registrado em nuxt.config.ts) em vez de
// import.meta.glob/readFileSync direto — só assim os arquivos ficam
// garantidamente embutidos no build de produção do Nitro (mesmo motivo do
// schema GraphQL em server/graphql/schema/index.ts).
//
// Tudo (html, source, dependências) é calculado aqui, a partir da MESMA
// leitura — em vez de o cliente recalcular dependências/ícones sozinho via
// PLAYGROUND_SOURCES (app/utils/playground-components.ts, que roda via
// import.meta.glob tanto no bundle do servidor quanto no do cliente, dois
// module graphs separados no Vite dev). Ter duas fontes paralelas da mesma
// informação é exatamente o tipo de coisa que diverge e causa mismatch de
// hidratação — aqui só existe UMA fonte, e o cliente só recebe o resultado
// já pronto via prop/payload.
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

export interface PlaygroundSourceInfo {
  source: string
  html: string
  dependencies: string[]
  hasIcons: boolean
}

const cache = new Map<string, PlaygroundSourceInfo>()

export async function getPlaygroundSourceInfo(componentKey: string): Promise<PlaygroundSourceInfo | null> {
  const cached = cache.get(componentKey)
  if (cached) return cached

  const storage = useStorage('assets:playground')
  const raw = await storage.getItem<string | Uint8Array>(`${componentKey}:${toPascalCase(componentKey)}.vue`)
  if (!raw) return null

  const source = toText(raw)
  const html = await codeToHtml(source, { lang: 'vue', theme: 'github-dark-default' })
  const dependencies = [...new Set([...source.matchAll(/@\/components\/ui\/([a-z-]+)/g)].map(m => m[1]!))].sort()
  const hasIcons = /@lucide\/vue/.test(source)

  const info: PlaygroundSourceInfo = { source, html, dependencies, hasIcons }
  cache.set(componentKey, info)
  return info
}
