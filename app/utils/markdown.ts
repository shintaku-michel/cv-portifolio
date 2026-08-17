import MarkdownIt from 'markdown-it'

// html:false (padrão) escapa tags HTML literais no markdown de origem —
// evita render de HTML não sanitizado (seção 34 do CLAUDE.md).
const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true })

export function renderMarkdown(source: string): string {
  return markdown.render(source)
}
