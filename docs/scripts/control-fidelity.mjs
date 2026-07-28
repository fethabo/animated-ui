// Fidelidad de los controles de un demo respecto de la API real de la librería
// (validación en build-content.mjs, junto a la de cobertura).
//
// El ControlPanel pasa el `default` de cada control como prop desde el mount,
// así que el descriptor del demo —y no la librería— gobierna el render inicial.
// Eso convierte a `controls` en una segunda copia de los defaults de la API, y
// esta validación es lo que la ata a la fuente (`generated/props.json`).
//
//   I1  el `default` del control coincide con el default de la librería,
//       salvo que el control declare `override: '<motivo>'`.
//   I2  para controles `number`, el default de la librería cae en [min, max].
//       NO se exime por `override`: un rango que deja afuera al default de la
//       API es un error de escala o de unidad, no una elección estética.

// --- Parser de literales -----------------------------------------------------
// Los descriptores son literales TS con comentarios, arrays y multilínea, así
// que se escanean respetando strings y comentarios en vez de regexear el bloque.

/** Índice del cierre del string que abre en `i`, o -1 si no cierra. */
function skipString(src, i) {
  const quote = src[i]
  for (let j = i + 1; j < src.length; j++) {
    if (src[j] === '\\') {
      j++
      continue
    }
    if (src[j] === quote) return j
  }
  return -1
}

/** Primer índice >= `i` (y < `to`) que no sea espacio ni comentario. */
function skipTrivia(src, i, to) {
  for (;;) {
    if (i >= to) return to
    if (src[i] === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i)
      i = nl < 0 ? to : nl + 1
      continue
    }
    if (src[i] === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2)
      i = end < 0 ? to : end + 2
      continue
    }
    if (/\s/.test(src[i])) {
      i++
      continue
    }
    return i
  }
}

/**
 * Índice del bracket que cierra al que abre en `start`, ignorando brackets
 * dentro de strings y comentarios. -1 si no balancea.
 */
function scanBalanced(src, start) {
  let depth = 0
  for (let i = start; i < src.length; i++) {
    const ch = src[i]
    if (ch === '/' && (src[i + 1] === '/' || src[i + 1] === '*')) {
      const next = skipTrivia(src, i, src.length)
      if (next === i) return -1
      i = next - 1
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      const end = skipString(src, i)
      if (end < 0) return -1
      i = end
      continue
    }
    if (ch === '[' || ch === '{' || ch === '(') depth++
    else if (ch === ']' || ch === '}' || ch === ')') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

/** Fin del valor que arranca en `i`: la coma de nivel 0, o `to`. */
function valueEnd(src, i, to) {
  while (i < to) {
    const ch = src[i]
    if (ch === '/' && (src[i + 1] === '/' || src[i + 1] === '*')) {
      const next = skipTrivia(src, i, to)
      if (next === i) break
      i = next
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      const end = skipString(src, i)
      i = end < 0 ? to : end + 1
      continue
    }
    if (ch === '[' || ch === '{' || ch === '(') {
      const end = scanBalanced(src, i)
      i = end < 0 ? to : end + 1
      continue
    }
    if (ch === ',') return i
    i++
  }
  return to
}

const KEY = /^(?:'([^']*)'|"([^"]*)"|([A-Za-z_$][\w$]*))\s*:/

/** Campos `clave: valor` de nivel superior de un literal de objeto. */
function objectFields(objSrc) {
  const fields = {}
  const to = objSrc.length - 1 // excluye la llave de cierre
  let i = 1
  while (i < to) {
    i = skipTrivia(objSrc, i, to)
    if (i >= to) break
    if (objSrc[i] === ',') {
      i++
      continue
    }
    const key = objSrc.slice(i, to).match(KEY)
    if (!key) {
      i++
      continue
    }
    i = skipTrivia(objSrc, i + key[0].length, to)
    const end = valueEnd(objSrc, i, to)
    fields[key[1] ?? key[2] ?? key[3]] = objSrc.slice(i, end).trim()
    i = end + 1
  }
  return fields
}

/**
 * Descriptores del array `controls` de un demo, o `null` si no lo declara.
 * Cada entrada es `{ prop, type, default, min, max, override, ... }` con los
 * valores como texto crudo del source.
 */
export function parseControls(demoSource) {
  const marker = demoSource.search(/export const controls\b/)
  if (marker < 0) return null
  // El `[` del array va después del `=`: el de la anotación de tipo
  // (`: DemoControl[]`) viene antes y es un par vacío.
  const assign = demoSource.indexOf('=', marker)
  if (assign < 0) return null
  const open = demoSource.indexOf('[', assign)
  if (open < 0) return null
  const close = scanBalanced(demoSource, open)
  if (close < 0) return null

  const controls = []
  let i = open + 1
  while (i < close) {
    i = skipTrivia(demoSource, i, close)
    if (i >= close) break
    if (demoSource[i] !== '{') {
      i++
      continue
    }
    const end = scanBalanced(demoSource, i)
    if (end < 0) break
    const fields = objectFields(demoSource.slice(i, end + 1))
    if (fields.prop) {
      // El nombre de la prop siempre es un string literal: se entrega limpio
      // (el resto de los campos quedan crudos, como texto del source).
      fields.prop = unquote(fields.prop)
      controls.push(fields)
    }
    i = end + 1
  }
  return controls
}

// --- Normalización -----------------------------------------------------------

/** Separador interno para comparar arrays sin colisionar con los valores. */
const UNIT = '\u0001'

function unquote(value) {
  const s = String(value).trim()
  if (s.length >= 2 && (s[0] === "'" || s[0] === '"') && s[s.length - 1] === s[0]) {
    return s.slice(1, -1)
  }
  return s
}

/** Elementos de nivel superior de un literal de array, o `null` si no lo es. */
function parseArrayLiteral(raw) {
  const s = String(raw).trim()
  if (!s.startsWith('[') || !s.endsWith(']')) return null
  const to = s.length - 1
  const items = []
  let i = 1
  while (i < to) {
    i = skipTrivia(s, i, to)
    if (i >= to) break
    const end = valueEnd(s, i, to)
    const item = s.slice(i, end).trim()
    if (item !== '') items.push(unquote(item))
    i = end + 1
  }
  return items
}

/**
 * Forma canónica de un default, para comparar el del control con el que
 * `props.json` transcribe del source: quita comillas envolventes, compara
 * números por valor (`0.4` === `.40`) y arrays elemento a elemento.
 */
export function canonical(raw) {
  if (raw === null || raw === undefined) return null
  const s = String(raw).trim()
  if (s === '') return null
  if (s === 'true' || s === 'false') return s
  if (Number.isFinite(Number(s))) return String(Number(s))
  const arr = parseArrayLiteral(s)
  if (arr) return `[${arr.join(UNIT)}]`
  return unquote(s)
}

// --- Validación --------------------------------------------------------------

/**
 * Valida I1 e I2 de los controles de un demo contra las props generadas.
 * Devuelve `{ errors, unverifiable }`; `unverifiable` lista los controles que
 * no se pudieron chequear, con su motivo, para reportarlos en vez de darlos
 * por aprobados.
 */
export function checkControlFidelity(slug, controls, propDocs) {
  const errors = []
  const unverifiable = []
  const byName = new Map((propDocs ?? []).map((p) => [p.name, p]))

  for (const control of controls) {
    const name = control.prop
    const doc = byName.get(name)

    if (!doc) {
      // No es prop del componente raíz: puede ser de un subcomponente que el
      // demo enruta (e.g. `depth` de ParallaxLayers.Layer). No es un error.
      unverifiable.push(`${slug}.${name} (no es prop del componente raíz)`)
      continue
    }
    if (doc.defaultValue === null || doc.defaultValue === undefined) {
      unverifiable.push(`${slug}.${name} (props.json no resuelve el default)`)
      continue
    }

    const libRaw = doc.defaultValue

    // I1 — default fiel (eximible con `override`).
    if (!control.override && canonical(control.default) !== canonical(libRaw)) {
      errors.push(
        `${slug}: el control "${name}" declara default ${control.default} pero la librería usa ${libRaw} — corregilo, o declará override: '<motivo>' si la divergencia es deliberada`,
      )
    }

    // I2 — el default de la librería es alcanzable (NO eximible).
    if (unquote(control.type) === 'number') {
      const libNum = Number(unquote(libRaw))
      const min = Number(control.min)
      const max = Number(control.max)
      if (Number.isFinite(libNum) && Number.isFinite(min) && Number.isFinite(max)) {
        if (libNum < min || libNum > max) {
          errors.push(
            `${slug}: el control "${name}" tiene rango [${control.min}, ${control.max}] pero el default de la librería es ${libRaw} — queda inalcanzable; revisá la escala/unidad de la prop (override NO exime de esto)`,
          )
        }
      }
    }
  }

  return { errors, unverifiable }
}
