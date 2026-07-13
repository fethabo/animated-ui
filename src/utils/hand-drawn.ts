/*
 * Generador procedural de paths SVG "a mano alzada" (Wave L, ver design.md de
 * `svg-stroke-highlighter-scribble`): shapes paramétricas emitidas como
 * strings `d` de curvas cuadráticas cuyos puntos y controles se perturban con
 * jitter seedable (`createPrng`) — misma seed y dimensiones ⇒ mismo path, y
 * el path se regenera adaptado a cualquier caja medida. La doble pasada
 * (`passes: 2`) repasa el trazo con otra perturbación: el look "marcador que
 * repasa" (e.g. el círculo que se cierra dos veces). Módulo puro sin DOM,
 * interno al paquete (como `noise.ts`); lo consumen `TextHighlighter` y las
 * shapes builtin de `ScribbleDecoration`.
 */
import { createPrng, type Prng } from './prng'

export interface HandDrawnOptions {
  /** Magnitud del jitter en px. Default: proporcional al lado menor de la caja. */
  jitter?: number
  /** Cantidad de pasadas del trazo (2 = repasado tipo marcador). Default según shape. */
  passes?: number
}

/** Contrato de toda shape hand-drawn: caja + seed ⇒ atributo `d`. */
export type HandDrawnShape = (
  width: number,
  height: number,
  seed: string | number,
  options?: HandDrawnOptions,
) => string

interface Pt {
  x: number
  y: number
}

/** Redondeo a 2 decimales: strings `d` compactos y estables. */
const round = (n: number) => Math.round(n * 100) / 100

/** Desvío aleatorio simétrico en `[-amount, amount]`. */
const jitterOf = (rng: Prng, amount: number) => (rng() * 2 - 1) * amount

/** Jitter default: proporcional al lado menor, acotado para no deformar. */
const defaultJitter = (width: number, height: number) =>
  Math.min(Math.max(Math.min(width, height) * 0.05, 1), 6)

/**
 * Una pasada "a mano" por los puntos dados: perturba cada punto y une
 * consecutivos con curvas cuadráticas de control perturbado cerca del punto
 * medio. Devuelve un subpath completo (empieza con `M`).
 */
function sketch(rng: Prng, points: Pt[], jitter: number): string {
  const jittered = points.map((p) => ({
    x: p.x + jitterOf(rng, jitter),
    y: p.y + jitterOf(rng, jitter),
  }))
  const [first, ...rest] = jittered
  let d = `M ${round(first.x)} ${round(first.y)}`
  let prev = first
  for (const p of rest) {
    const cx = (prev.x + p.x) / 2 + jitterOf(rng, jitter)
    const cy = (prev.y + p.y) / 2 + jitterOf(rng, jitter)
    d += ` Q ${round(cx)} ${round(cy)} ${round(p.x)} ${round(p.y)}`
    prev = p
  }
  return d
}

/** N pasadas de `sketch` sobre los mismos puntos, alternando la dirección. */
function sketchPasses(rng: Prng, points: Pt[], jitter: number, passes: number): string {
  const subpaths: string[] = []
  for (let i = 0; i < passes; i++) {
    const pts = i % 2 === 0 ? points : [...points].reverse()
    subpaths.push(sketch(rng, pts, jitter))
  }
  return subpaths.join(' ')
}

/** Puntos equiespaciados entre `a` y `b` (extremos incluidos). */
function line(a: Pt, b: Pt, segments: number): Pt[] {
  const pts: Pt[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    pts.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
  }
  return pts
}

/** Subrayado recto (con temblor) sobre el borde inferior de la caja. */
export const underline: HandDrawnShape = (width, height, seed, options = {}) => {
  const rng = createPrng(seed)
  const jitter = options.jitter ?? defaultJitter(width, height)
  const y = height - jitter
  return sketchPasses(rng, line({ x: 0, y }, { x: width, y }, 3), jitter, options.passes ?? 2)
}

/** Subrayado ondulado (media onda arriba, media abajo) sobre el borde inferior. */
export const wavyUnderline: HandDrawnShape = (width, height, seed, options = {}) => {
  const rng = createPrng(seed)
  const jitter = options.jitter ?? defaultJitter(width, height)
  const passes = options.passes ?? 1
  const amplitude = Math.max(height * 0.08, 2.5)
  const halfWaves = Math.max(4, Math.round(width / (amplitude * 4)))
  const step = width / halfWaves
  const y = height - amplitude - 1
  const subpaths: string[] = []
  for (let p = 0; p < passes; p++) {
    let d = `M ${round(jitterOf(rng, jitter))} ${round(y + jitterOf(rng, jitter))}`
    for (let i = 0; i < halfWaves; i++) {
      const cx = step * (i + 0.5) + jitterOf(rng, jitter)
      // El ápice de la cuadrática queda a mitad de camino del control: ±amplitude.
      const cy = y + (i % 2 === 0 ? -1 : 1) * amplitude * 2 + jitterOf(rng, jitter)
      const ex = step * (i + 1) + jitterOf(rng, jitter)
      const ey = y + jitterOf(rng, jitter)
      d += ` Q ${round(cx)} ${round(cy)} ${round(ex)} ${round(ey)}`
    }
    subpaths.push(d)
  }
  return subpaths.join(' ')
}

/** Elipse abierta alrededor de la caja, que se pasa de largo al cerrar. */
export const circle: HandDrawnShape = (width, height, seed, options = {}) => {
  const rng = createPrng(seed)
  const jitter = options.jitter ?? defaultJitter(width, height)
  const passes = options.passes ?? 2
  const cx = width / 2
  const cy = height / 2
  const rx = width / 2 + Math.max(width * 0.06, 4)
  const ry = height / 2 + Math.max(height * 0.16, 4)
  const subpaths: string[] = []
  for (let p = 0; p < passes; p++) {
    const start = -Math.PI / 2 + jitterOf(rng, 0.6)
    const sweep = Math.PI * 2 * 1.06 // cierra pasándose un poco
    const steps = 12
    const pts: Pt[] = []
    for (let i = 0; i <= steps; i++) {
      const a = start + (sweep * i) / steps
      pts.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry })
    }
    subpaths.push(sketch(rng, pts, jitter))
  }
  return subpaths.join(' ')
}

/**
 * Franja de resaltador: una línea por el centro vertical de la caja; el
 * grosor lo pone el `stroke-width` del consumidor (≈ alto del texto).
 */
export const highlight: HandDrawnShape = (width, height, seed, options = {}) => {
  const rng = createPrng(seed)
  const jitter = options.jitter ?? defaultJitter(width, height)
  const y = height * 0.5
  return sketchPasses(
    rng,
    line({ x: -2, y }, { x: width + 2, y }, 3),
    jitter,
    options.passes ?? 1,
  )
}

/** Tachado: línea por el centro con una leve pendiente. */
export const strike: HandDrawnShape = (width, height, seed, options = {}) => {
  const rng = createPrng(seed)
  const jitter = options.jitter ?? defaultJitter(width, height)
  return sketchPasses(
    rng,
    line({ x: 0, y: height * 0.54 }, { x: width, y: height * 0.46 }, 3),
    jitter,
    options.passes ?? 1,
  )
}

/** Recuadro alrededor de la caja, con overshoot al cerrar la vuelta. */
export const box: HandDrawnShape = (width, height, seed, options = {}) => {
  const rng = createPrng(seed)
  const jitter = options.jitter ?? defaultJitter(width, height)
  const o = 2 // respiro entre el trazo y el contenido
  const corners: Pt[] = [
    { x: -o, y: -o },
    { x: width + o, y: -o },
    { x: width + o, y: height + o },
    { x: -o, y: height + o },
  ]
  const loop = [...corners, corners[0]]
  const pts: Pt[] = [loop[0]]
  for (let i = 1; i < loop.length; i++) {
    const a = loop[i - 1]
    const b = loop[i]
    pts.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, b)
  }
  pts.push({ x: -o + width * 0.15, y: -o }) // se pasa un poco al cerrar
  return sketchPasses(rng, pts, jitter, options.passes ?? 1)
}

/** Flecha con fuste arqueado apuntando a la derecha (rotable via CSS transform). */
export const arrow: HandDrawnShape = (width, height, seed, options = {}) => {
  const rng = createPrng(seed)
  const jitter = options.jitter ?? defaultJitter(width, height)
  const from = { x: width * 0.06, y: height * 0.62 }
  const to = { x: width * 0.92, y: height * 0.42 }
  const mid = { x: width * 0.5, y: height * 0.62 + jitterOf(rng, height * 0.18) }
  const shaft = sketchPasses(rng, [from, mid, to], jitter, options.passes ?? 1)
  const angle = Math.atan2(to.y - mid.y, to.x - mid.x)
  const headLen = Math.min(width, height) * 0.28
  const spread = 0.5 // rad de apertura de cada ala
  const wing = (sign: number): Pt => ({
    x: to.x - Math.cos(angle + sign * spread) * headLen,
    y: to.y - Math.sin(angle + sign * spread) * headLen,
  })
  const head = sketch(rng, [wing(1), to, wing(-1)], jitter * 0.7)
  return `${shaft} ${head}`
}

/** Asterisco: tres trazos que se cruzan por el centro. */
export const asterisk: HandDrawnShape = (width, height, seed, options = {}) => {
  const rng = createPrng(seed)
  const jitter = options.jitter ?? defaultJitter(width, height)
  const cx = width / 2
  const cy = height / 2
  const radius = Math.min(width, height) * 0.45
  const angles = [Math.PI / 2, Math.PI / 2 + Math.PI / 3, Math.PI / 2 - Math.PI / 3]
  return angles
    .map((a) => {
      const dx = Math.cos(a) * radius
      const dy = Math.sin(a) * radius
      return sketch(
        rng,
        [
          { x: cx - dx, y: cy - dy },
          { x: cx, y: cy },
          { x: cx + dx, y: cy + dy },
        ],
        jitter,
      )
    })
    .join(' ')
}

/** Espiral elíptica desde el centro hacia afuera (~2.5 vueltas). */
export const spiral: HandDrawnShape = (width, height, seed, options = {}) => {
  const rng = createPrng(seed)
  const jitter = (options.jitter ?? defaultJitter(width, height)) * 0.6
  const cx = width / 2
  const cy = height / 2
  const rx = (width / 2) * 0.92
  const ry = (height / 2) * 0.92
  const turns = 2.5
  const steps = Math.round(turns * 8)
  const pts: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = t * turns * Math.PI * 2
    pts.push({ x: cx + Math.cos(a) * rx * t, y: cy + Math.sin(a) * ry * t })
  }
  return sketch(rng, pts, jitter)
}

/** Registro de shapes hand-drawn por nombre (lo consume `TextHighlighter`). */
export const handDrawnShapes = {
  underline,
  'wavy-underline': wavyUnderline,
  circle,
  highlight,
  strike,
  box,
  arrow,
  asterisk,
  spiral,
} satisfies Record<string, HandDrawnShape>

export type HandDrawnShapeName = keyof typeof handDrawnShapes
