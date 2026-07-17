// Genera docs/public/sitemap.xml y docs/public/robots.txt desde registry.json.
// Encadenado en `npm run build`: el sitemap nunca puede divergir de las rutas
// realmente publicadas (misma fuente que el sidebar).

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE_URL = 'https://animated-ui-docs.fethabo.cloud'
const LANGS = ['es', 'en']

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const registry = JSON.parse(readFileSync(join(docsRoot, 'src', 'registry.json'), 'utf8'))

const paths = ['', ...registry.components.map((c) => `/components/${c.slug}`)]

function urlEntry(path) {
  const alternates = LANGS.map(
    (lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}/${lang}${path}"/>`,
  ).join('\n')
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en${path}"/>`
  return LANGS.map(
    (lang) =>
      `  <url>\n    <loc>${SITE_URL}/${lang}${path}</loc>\n${alternates}\n${xDefault}\n  </url>`,
  ).join('\n')
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map(urlEntry).join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

const publicDir = join(docsRoot, 'public')
mkdirSync(publicDir, { recursive: true })
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)
writeFileSync(join(publicDir, 'robots.txt'), robots)

console.log(
  `[docs] build-seo OK — sitemap.xml con ${paths.length * LANGS.length} URLs, robots.txt → docs/public/`,
)
