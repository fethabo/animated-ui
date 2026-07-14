// Pipeline de contenido de la docs. Corre antes de dev y build (pre-scripts):
//   1. valida registry vs exports de package.json (task 2.2)
//   2. extrae props desde los JSDoc de src/**/types.ts (task 2.3)
//   3. valida completitud de contenido y traducciones (task 2.4)
// Falla con exit code != 0 ante cualquier invariante rota: la web nunca puede
// buildear desincronizada del paquete.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { GLOBAL_EXCLUDE, isExcludedByType, excludedProps } from './control-exclusions.mjs'

/** Nombres de prop declarados en el array `controls` de un demo (literal). */
function declaredControlProps(demoSource) {
  const match = demoSource.match(/export const controls[^=]*=\s*\[([\s\S]*?)\n\]/)
  if (!match) return null // el demo no declara controls
  const names = new Set()
  for (const m of match[1].matchAll(/\bprop:\s*'([^']+)'/g)) names.add(m[1])
  return names
}

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(docsRoot, '..')

const errors = []

// --- 1. Registry vs exports -------------------------------------------------

// Subpath exports que no son componentes (no requieren página de docs).
const NON_COMPONENT_EXPORTS = new Set(['.'])

const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'))
const registry = JSON.parse(readFileSync(join(docsRoot, 'src', 'registry.json'), 'utf8'))

const exportSlugs = Object.keys(pkg.exports ?? {})
  .filter((key) => !NON_COMPONENT_EXPORTS.has(key))
  .map((key) => key.replace(/^\.\//, ''))

const registrySlugs = registry.components.map((c) => c.slug)
const registrySet = new Set(registrySlugs)
const exportSet = new Set(exportSlugs)

if (registrySet.size !== registrySlugs.length) {
  const dupes = registrySlugs.filter((slug, i) => registrySlugs.indexOf(slug) !== i)
  errors.push(`registry.json tiene slugs duplicados: ${[...new Set(dupes)].join(', ')}`)
}

for (const slug of exportSlugs) {
  if (!registrySet.has(slug)) {
    errors.push(
      `El export "./${slug}" de package.json no tiene entrada en docs/src/registry.json — todo componente publicado debe estar en la docs`,
    )
  }
}

for (const component of registry.components) {
  if (!exportSet.has(component.slug)) {
    errors.push(
      `La entrada "${component.slug}" de registry.json no corresponde a ningún export de package.json — entrada huérfana`,
    )
  }
  if (!registry.categories.includes(component.category)) {
    errors.push(
      `La entrada "${component.slug}" usa la categoría desconocida "${component.category}"`,
    )
  }
}

// --- Resultado ----------------------------------------------------------------

if (errors.length > 0) {
  console.error(`\n[docs] build-content FALLÓ (${errors.length} error(es)):\n`)
  for (const error of errors) console.error(`  ✗ ${error}`)
  console.error('')
  process.exit(1)
}

console.log(
  `[docs] build-content OK — ${registry.components.length} componentes en ${registry.categories.length} categorías, sincronizados con package.json v${pkg.version}`,
)

// --- 2. Extracción de props (falla el proceso si el extractor falla) ----------

execFileSync(process.execPath, [join(docsRoot, 'scripts', 'extract-props.mjs')], {
  stdio: 'inherit',
  cwd: docsRoot,
})

// --- 3. Completitud de contenido y traducciones -------------------------------
// Estricto en build (prebuild); en dev (--lax) degrada a warnings para poder
// desarrollar contenido incrementalmente. La spec exige que el BUILD falle —
// el dev server puede correr incompleto.

const lax = process.argv.includes('--lax')
const contentErrors = []

const propsGenerated = JSON.parse(
  readFileSync(join(docsRoot, 'src', 'generated', 'props.json'), 'utf8'),
)

// Traducciones ES de props: un archivo por componente (content/props-es/<slug>.json)
// para poder trabajarlos en paralelo sin conflictos.
const propsEsDir = join(docsRoot, 'content', 'props-es')
const propsEs = {}
if (existsSync(propsEsDir)) {
  for (const file of readdirSync(propsEsDir)) {
    if (!file.endsWith('.json')) continue
    propsEs[file.replace(/\.json$/, '')] = JSON.parse(readFileSync(join(propsEsDir, file), 'utf8'))
  }
}

for (const { slug, example } of registry.components) {
  // `example` en el registry permite mapear a un archivo de /examples con otro
  // nombre (e.g. animated-background → aurora-hero).
  const exampleFile = `${example ?? slug}.tsx`
  const artifacts = [
    [join(docsRoot, 'content', `${slug}.es.md`), `prosa ES (docs/content/${slug}.es.md)`],
    [join(docsRoot, 'content', `${slug}.en.md`), `prosa EN (docs/content/${slug}.en.md)`],
    [join(docsRoot, 'content', 'usage', `${slug}.tsx`), `snippet de uso (docs/content/usage/${slug}.tsx)`],
    [join(docsRoot, 'src', 'demos', `${slug}.tsx`), `demo (docs/src/demos/${slug}.tsx)`],
    [join(repoRoot, 'examples', exampleFile), `ejemplo standalone (examples/${exampleFile})`],
  ]
  for (const [path, label] of artifacts) {
    if (!existsSync(path)) contentErrors.push(`${slug}: falta ${label}`)
  }

  // Cobertura de traducción: toda prop con descripción EN necesita su ES.
  // (props sin descripción — className/style — no exigen traducción.)
  const esEntries = propsEs[slug] ?? {}
  for (const prop of propsGenerated[slug] ?? []) {
    if (prop.description.trim() === '') continue
    if (typeof esEntries[prop.name] !== 'string' || esEntries[prop.name].trim() === '') {
      contentErrors.push(`${slug}: la prop "${prop.name}" no tiene traducción en content/props-es/`)
    }
  }
  // Traducciones huérfanas: siempre warning (permite limpiar sin bloquear).
  const knownProps = new Set((propsGenerated[slug] ?? []).map((p) => p.name))
  for (const name of Object.keys(esEntries)) {
    if (!knownProps.has(name)) {
      console.warn(`[docs] warning: props-es tiene la entrada huérfana "${slug}.${name}"`)
    }
  }

  // Cobertura de controles: todo demo declara controls, y toda prop pública
  // controlable (menos las excluidas) tiene su control. El objeto TiltState/
  // handles no aparecen en props (son del componente), así que props.json ya
  // son solo las props del componente.
  const demoPath = join(docsRoot, 'src', 'demos', `${slug}.tsx`)
  if (existsSync(demoPath)) {
    const declared = declaredControlProps(readFileSync(demoPath, 'utf8'))
    if (declared === null) {
      contentErrors.push(`${slug}: el demo no declara controles (export const controls)`)
    } else {
      const perComp = excludedProps(slug)
      for (const prop of propsGenerated[slug] ?? []) {
        if (GLOBAL_EXCLUDE.has(prop.name)) continue
        if (perComp.has(prop.name)) continue
        if (isExcludedByType(prop.type)) continue
        if (!declared.has(prop.name)) {
          contentErrors.push(
            `${slug}: la prop controlable "${prop.name}" no tiene control en el panel (agregala a controls o excluila en control-exclusions.mjs)`,
          )
        }
      }
    }
  }
}

for (const slug of Object.keys(propsEs)) {
  if (!registry.components.some((c) => c.slug === slug)) {
    console.warn(`[docs] warning: props-es tiene el componente huérfano "${slug}"`)
  }
}

if (contentErrors.length > 0) {
  const header = `[docs] contenido incompleto (${contentErrors.length} faltante(s))`
  if (lax) {
    console.warn(`\n${header} — modo dev, continúa con warnings:\n`)
    for (const error of contentErrors.slice(0, 20)) console.warn(`  ! ${error}`)
    if (contentErrors.length > 20) console.warn(`  … y ${contentErrors.length - 20} más`)
    console.warn('')
  } else {
    console.error(`\n${header} — el build no puede salir desincronizado:\n`)
    for (const error of contentErrors) console.error(`  ✗ ${error}`)
    console.error('')
    process.exit(1)
  }
} else {
  console.log('[docs] contenido completo — prosa es/en, demos, ejemplos, usage y props-es OK')
}

// --- 4. Syntax highlighting en build time (Shiki) ------------------------------
// Por componente emite src/generated/code/<slug>.json con { example, usage },
// cada uno { code, html }. El cliente no shippea ningún highlighter.

const { codeToHtml } = await import('shiki')
const codeDir = join(docsRoot, 'src', 'generated', 'code')
mkdirSync(codeDir, { recursive: true })

let highlighted = 0
for (const { slug, example } of registry.components) {
  const sources = {
    example: join(repoRoot, 'examples', `${example ?? slug}.tsx`),
    usage: join(docsRoot, 'content', 'usage', `${slug}.tsx`),
  }
  const entry = {}
  for (const [kind, path] of Object.entries(sources)) {
    if (!existsSync(path)) continue // ya reportado por la etapa 3
    const code = readFileSync(path, 'utf8')
    entry[kind] = {
      code,
      html: await codeToHtml(code, { lang: 'tsx', theme: 'vitesse-dark' }),
    }
    highlighted++
  }
  writeFileSync(join(codeDir, `${slug}.json`), JSON.stringify(entry))
}

console.log(`[docs] shiki OK — ${highlighted} bloques resaltados → src/generated/code/`)

// --- 5. Prosa Markdown → HTML ---------------------------------------------------
// docs/content/<slug>.<lang>.md (frontmatter title/description + body) →
// src/generated/prose/<slug>.json = { es: {title, description, html}, en: {...} }

const { marked } = await import('marked')
const proseDir = join(docsRoot, 'src', 'generated', 'prose')
mkdirSync(proseDir, { recursive: true })

/** Frontmatter mínimo: bloque --- inicial con `clave: valor` por línea. */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { meta: {}, body: raw }
  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx > 0) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
  return { meta, body: raw.slice(match[0].length) }
}

let proseCount = 0
for (const { slug } of registry.components) {
  const entry = {}
  for (const lang of ['es', 'en']) {
    const path = join(docsRoot, 'content', `${slug}.${lang}.md`)
    if (!existsSync(path)) continue // ya reportado por la etapa 3
    const { meta, body } = parseFrontmatter(readFileSync(path, 'utf8'))
    if (!meta.title || !meta.description) {
      console.error(`[docs] ✗ ${slug}.${lang}.md: frontmatter incompleto (requiere title y description)`)
      process.exit(1)
    }
    entry[lang] = {
      title: meta.title,
      description: meta.description,
      html: marked.parse(body),
    }
    proseCount++
  }
  if (Object.keys(entry).length > 0) {
    writeFileSync(join(proseDir, `${slug}.json`), JSON.stringify(entry))
  }
}

console.log(`[docs] prosa OK — ${proseCount} documentos → src/generated/prose/`)
