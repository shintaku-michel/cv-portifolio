import { defineEventHandler, getRequestURL, setHeader } from 'h3'

// Gerado dinamicamente (não em public/) para poder referenciar a URL
// absoluta do sitemap sem depender de um domínio de produção fixo ainda.
export default defineEventHandler((event) => {
  const origin = getRequestURL(event).origin

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return [
    'User-agent: *',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    `Sitemap: ${origin}/sitemap.xml`
  ].join('\n')
})
