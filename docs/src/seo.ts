import { useEffect } from 'react'
import type { Lang } from './i18n/lang'

/** Único deploy público: parametrizarlo por env agregaría configuración sin beneficio. */
export const SITE_URL = 'https://animated-ui-docs.fethabo.cloud'

interface SeoInput {
  title: string
  description: string
  /** Ruta sin el segmento de idioma, e.g. '' para home, '/components/dock' para un componente. */
  path: string
  lang: Lang
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string, hreflang?: string): void {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Actualiza title, meta description, canonical, alternates hreflang y
 * og:title/og:description/og:url para la vista activa. Reutiliza los nodos
 * existentes (por selector) en vez de acumularlos en cada navegación.
 */
export function useSeo({ title, description, path, lang }: SeoInput): void {
  useEffect(() => {
    document.title = title
    upsertMeta('name', 'description', description)

    const canonical = `${SITE_URL}/${lang}${path}`
    upsertLink('canonical', canonical)
    upsertLink('alternate', `${SITE_URL}/es${path}`, 'es')
    upsertLink('alternate', `${SITE_URL}/en${path}`, 'en')
    upsertLink('alternate', `${SITE_URL}/en${path}`, 'x-default')

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
  }, [title, description, path, lang])
}
