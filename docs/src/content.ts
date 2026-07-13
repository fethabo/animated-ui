import type { ComponentType } from 'react'
import propsJson from './generated/props.json'
import type { Lang } from './i18n/lang'

export interface PropDoc {
  name: string
  type: string
  required: boolean
  defaultValue: string | null
  description: string
}

export interface CodeEntry {
  code: string
  html: string
}

export interface ProseEntry {
  title: string
  description: string
  html: string
}

const allProps = propsJson as Record<string, PropDoc[]>

// Capa de traducción ES: un JSON por componente, bundleado eager (es texto corto).
const esModules = import.meta.glob('../content/props-es/*.json', {
  eager: true,
  import: 'default',
})
const esDescriptions: Record<string, Record<string, string>> = {}
for (const [path, entries] of Object.entries(esModules)) {
  const slug = path.replace(/^.*\/([^/]+)\.json$/, '$1')
  esDescriptions[slug] = entries as Record<string, string>
}

/**
 * Props de un componente en el idioma pedido. EN sale del JSDoc extraído;
 * ES reemplaza la descripción con la capa de traducción content/props-es/
 * (la cobertura la garantiza build-content en build).
 */
export function propsFor(slug: string, lang: Lang): PropDoc[] {
  const props = allProps[slug] ?? []
  if (lang === 'en') return props
  const es = esDescriptions[slug] ?? {}
  return props.map((p) => ({ ...p, description: es[p.name] ?? p.description }))
}

// Módulos generados, cargados lazy por vista: el código resaltado y la prosa
// de un componente no entran al bundle de otras rutas.
const codeModules = import.meta.glob('./generated/code/*.json')
const proseModules = import.meta.glob('./generated/prose/*.json')

export async function codeFor(slug: string): Promise<{ example?: CodeEntry; usage?: CodeEntry }> {
  const loader = codeModules[`./generated/code/${slug}.json`]
  if (!loader) return {}
  return ((await loader()) as { default: { example?: CodeEntry; usage?: CodeEntry } }).default
}

export async function proseFor(
  slug: string,
  lang: Lang,
): Promise<ProseEntry | undefined> {
  const loader = proseModules[`./generated/prose/${slug}.json`]
  if (!loader) return undefined
  const entry = ((await loader()) as { default: Partial<Record<Lang, ProseEntry>> }).default
  return entry[lang] ?? entry.en ?? entry.es
}

// Demos: un módulo por slug con export default (componente React), lazy.
// Un demo puede exportar `demoLayout: 'flow'` para renderizarse sin recorte ni
// min-height fijo (necesario para componentes scroll-driven con position:sticky,
// que se rompen dentro de un ancestro overflow:hidden).
export const demoModules = import.meta.glob('./demos/*.tsx')

export interface DemoModule {
  default: ComponentType
  demoLayout?: 'frame' | 'flow'
}

export async function demoFor(slug: string): Promise<DemoModule | undefined> {
  const loader = demoModules[`./demos/${slug}.tsx`]
  if (!loader) return undefined
  return (await loader()) as DemoModule
}
