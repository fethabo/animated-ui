// Extracción de props desde los JSDoc de src/components/*/types.ts (y hooks).
// Emite docs/src/generated/props.json: { [slug]: PropDoc[] }.
// El archivo generado NO se commitea ni se edita a mano; los overrides por
// prop se declaran en registry.json (campo opcional `propOverrides`).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import docgen from 'react-docgen-typescript'

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(docsRoot, '..')

const registry = JSON.parse(readFileSync(join(docsRoot, 'src', 'registry.json'), 'utf8'))

// Props heredadas de HTMLAttributes/DOM que no documentamos por componente.
const parser = docgen.withCustomConfig(join(repoRoot, 'tsconfig.json'), {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => {
    if (!prop.parent) return true
    return !prop.parent.fileName.includes('node_modules')
  },
})

/** `Default: \`x\`` en la descripción JSDoc → default extraído. */
function splitDefault(description) {
  const match = description.match(/Default:\s*`([^`]+)`\.?/)
  if (!match) return { description, defaultValue: null }
  return {
    description: description.replace(match[0], '').replace(/\s{2,}/g, ' ').trim(),
    defaultValue: match[1],
  }
}

const errors = []
const result = {}

for (const component of registry.components) {
  const typesFile = join(repoRoot, 'src', 'components', component.name, 'index.tsx')
  if (!existsSync(typesFile)) {
    errors.push(`${component.slug}: no existe ${typesFile}`)
    continue
  }

  const parsed = parser.parse(typesFile)
  const doc = parsed.find((d) => d.displayName === component.name)
  if (!doc) {
    errors.push(
      `${component.slug}: react-docgen-typescript no encontró el componente ${component.name} en index.tsx (encontró: ${parsed.map((d) => d.displayName).join(', ') || 'nada'})`,
    )
    continue
  }

  const overrides = component.propOverrides ?? {}
  const props = Object.values(doc.props)
    .map((prop) => {
      const { description, defaultValue } = splitDefault(prop.description ?? '')
      const base = {
        name: prop.name,
        type: prop.type?.name ?? 'unknown',
        required: Boolean(prop.required),
        defaultValue,
        description,
      }
      return { ...base, ...(overrides[prop.name] ?? {}) }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  if (props.length === 0) {
    errors.push(`${component.slug}: 0 props extraídas — revisar tipos o el propFilter`)
    continue
  }

  result[component.slug] = props
}

if (errors.length > 0) {
  console.error(`\n[docs] extract-props FALLÓ (${errors.length} error(es)):\n`)
  for (const error of errors) console.error(`  ✗ ${error}`)
  console.error('')
  process.exit(1)
}

const outDir = join(docsRoot, 'src', 'generated')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'props.json'), JSON.stringify(result, null, 2))

const totalProps = Object.values(result).reduce((n, props) => n + props.length, 0)
console.log(
  `[docs] extract-props OK — ${totalProps} props de ${Object.keys(result).length} componentes → src/generated/props.json`,
)
