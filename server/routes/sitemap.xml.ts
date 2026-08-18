import { defineEventHandler, getRequestURL, setHeader } from 'h3'
import { PostService } from '../services/post.service'
import { ProjectService } from '../services/project.service'

type UrlEntry = { loc: string, lastmod?: string, changefreq?: string, priority?: string }

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function toXml(urls: UrlEntry[]) {
  const items = urls.map((url) => {
    const parts = [`    <loc>${escapeXml(url.loc)}</loc>`]
    if (url.lastmod) parts.push(`    <lastmod>${url.lastmod}</lastmod>`)
    if (url.changefreq) parts.push(`    <changefreq>${url.changefreq}</changefreq>`)
    if (url.priority) parts.push(`    <priority>${url.priority}</priority>`)
    return `  <url>\n${parts.join('\n')}\n  </url>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join('\n')}\n</urlset>`
}

// Só projetos/posts PUBLISHED entram — DRAFT nunca deve ser indexado
// (seção 31), e os services já filtram isso por padrão.
export default defineEventHandler(async (event) => {
  const origin = getRequestURL(event).origin

  const [projects, posts] = await Promise.all([
    ProjectService.getPublished(),
    PostService.getPublished()
  ])

  const urls: UrlEntry[] = [
    { loc: `${origin}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${origin}/projetos`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${origin}/posts`, changefreq: 'weekly', priority: '0.8' },
    ...projects.map(p => ({
      loc: `${origin}/projetos/${p.slug}`,
      lastmod: new Date(p.updatedAt).toISOString(),
      changefreq: 'monthly',
      priority: '0.6'
    })),
    ...posts.map(p => ({
      loc: `${origin}/posts/${p.slug}`,
      lastmod: new Date(p.updatedAt).toISOString(),
      changefreq: 'monthly',
      priority: '0.6'
    }))
  ]

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return toXml(urls)
})
