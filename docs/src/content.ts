import type { ComponentType } from 'react'
import propsJson from './generated/props.json'
import type { Lang } from './i18n/lang'

/**
 * Descriptor declarativo de un control del panel interactivo de un demo.
 * El demo bindea el valor de cada control a la prop homónima del componente.
 *
 * `default` es el valor con el que el demo MONTA (el panel lo pasa como prop
 * desde el primer render), así que gobierna el render inicial por sobre el
 * default de la librería. Por eso `build-content.mjs` lo valida contra
 * `generated/props.json`; ver `override` para las divergencias deliberadas.
 */
export type DemoControl =
  | { prop: string; type: 'number'; min: number; max: number; step?: number; default: number; label?: string; override?: string }
  | { prop: string; type: 'boolean'; default: boolean; label?: string; override?: string }
  | { prop: string; type: 'enum'; options: string[]; default: string; label?: string; override?: string }
  | { prop: string; type: 'color'; default: string; label?: string; override?: string }
  | { prop: string; type: 'text'; default: string; label?: string; override?: string }
  | { prop: string; type: 'multi'; options: string[]; default: string[]; asColors?: boolean; label?: string; override?: string }

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
// Un demo puede exportar:
// - `demoLayout: 'flow'` para renderizarse sin recorte ni min-height fijo
//   (necesario para componentes scroll-driven con position:sticky, que se
//   rompen dentro de un ancestro overflow:hidden).
// - `controls: DemoControl[]` para exponer un panel interactivo; en ese caso
//   el componente default recibe las props controladas.
//
// Fidelidad de los controles (validada en `scripts/build-content.mjs`):
//
//   I1  el `default` del control coincide con el default de la librería.
//   I2  para controles `number`, el default de la librería cae en [min, max].
//
// `override: '<motivo>'` exime de I1 y solo de I1. Va cuando el demo elige a
// propósito un valor distinto del default de la API — típicamente para que el
// efecto se note (`glare` encendido en TiltCard, `links` en ParticleField).
// El motivo se escribe concreto, no genérico: explica qué muestra el demo con
// ese valor que no mostraría con el default.
//
// `override` NUNCA va para silenciar I2. Un rango que deja afuera al default
// de la librería no es una elección estética: es un error de escala o de
// unidad (fue el caso de `click-spark.duration` y `cursor-trail.life`, ambos
// en segundos y declarados como si fueran milisegundos). Se corrige el rango.
export const demoModules = import.meta.glob('./demos/*.tsx')

export interface DemoModule {
  default: ComponentType<Record<string, unknown>>
  // 'frame' (default): demo recortado en un frame de alto fijo.
  // 'flow': sin recorte ni min-height (scroll-driven con position:sticky).
  // 'full-bleed': además rompe el ancho del artículo y ocupa el viewport
  //   (componentes inherentemente full-viewport: paneles 100vw, etc.).
  demoLayout?: 'frame' | 'flow' | 'full-bleed' | '3d'
  controls?: DemoControl[]
}

export async function demoFor(slug: string): Promise<DemoModule | undefined> {
  const loader = demoModules[`./demos/${slug}.tsx`]
  if (!loader) return undefined
  return (await loader()) as DemoModule
}
