import MarkdownIt from 'markdown-it'

// html:false (padrão) escapa tags HTML literais no markdown de origem —
// evita render de HTML não sanitizado (seção 34 do CLAUDE.md).
const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true })

export function renderMarkdown(source: string): string {
  return markdown.render(source)
}

// Extrai o texto puro do post, um item por bloco (parágrafo, item de
// lista, título, citação) — usado pelo leitor imersivo, que lê e destaca
// só o texto, sem formatação. Só roda no cliente (usa o DOM do navegador
// pra não reescrever um parser de HTML só pra isso).
export function extractReadableBlocks(html: string): string[] {
  if (typeof document === 'undefined') return []

  const container = document.createElement('div')
  container.innerHTML = html

  const blocks: string[] = []
  container.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote').forEach((el) => {
    const text = el.textContent?.trim().replace(/\s+/g, ' ')
    if (text) blocks.push(text)
  })
  return blocks
}

// Heurística simples pra separar frases (usada pelo modo de foco "por
// linha") — não é perfeita com abreviações, mas é suficiente pra leitura.
export function splitSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g)
  return (matches ?? [text]).map(s => s.trim()).filter(Boolean)
}
