/*
 * Ruteo procedural de "circuito PCB" (ver design.md, Decisión 3): múltiples
 * caminos de random walk ortogonal sobre una grilla, con giros restringidos a
 * 90°, favoreciendo tramos rectos largos (las pistas "respiran"), sembrando
 * pads en terminaciones y uniones. No es un autorouter ni busca validez
 * eléctrica: busca apariencia PCB convincente. Función pura y determinista por
 * seed: misma seed + tamaño + densidad ⇒ mismo trazado.
 */
import { createPrng, int, pick, type Prng } from '../../utils/prng'

export interface Point {
  x: number
  y: number
}

export interface RouterOptions {
  /** Ancho del área en px. */
  width: number
  /** Alto del área en px. */
  height: number
  /** Semilla del trazado. */
  seed: string | number
  /** Densidad de pistas (escala lineal con la cantidad de caminos). */
  density: number
}

export interface CircuitLayout {
  /** Pistas como polilíneas (solo vértices/esquinas) en px. */
  tracks: Point[][]
  /** Pads (uniones y terminaciones) en px. */
  pads: Point[]
  /** Lado de la celda de grilla en px (para escalar el radio de los pads). */
  cell: number
}

/** Lado nominal de la celda de grilla en px. */
const CELL = 36
/** Probabilidad de seguir recto en cada paso (favorece tramos largos). */
const STRAIGHT_BIAS = 0.86

/** Direcciones ortogonales: 0,1 horizontales; 2,3 verticales. */
const DIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

/**
 * Genera el trazado de circuito para el área dada. El resultado es estable
 * para la misma `seed`, tamaño y `density`. Todas las coordenadas quedan
 * dentro de `[0, width] × [0, height]` (la grilla se centra en el área).
 */
export function routeCircuit({ width, height, seed, density }: RouterOptions): CircuitLayout {
  const tracks: Point[][] = []
  const pads: Point[] = []
  if (width <= 0 || height <= 0) return { tracks, pads, cell: CELL }

  const cols = Math.max(2, Math.floor(width / CELL))
  const rows = Math.max(2, Math.floor(height / CELL))
  // Semilla compuesta con el tamaño de grilla: el mismo trazado lógico
  // reescala de forma determinista al cambiar el contenedor.
  const rng = createPrng(`${seed}:${cols}x${rows}:${density}`)

  // Grilla centrada: los centros de celda nunca caen fuera del área.
  const offsetX = (width - cols * CELL) / 2
  const offsetY = (height - rows * CELL) / 2
  const toPx = (c: number, r: number): Point => ({
    x: offsetX + (c + 0.5) * CELL,
    y: offsetY + (r + 0.5) * CELL,
  })

  const occupied = new Set<number>()
  const cellKey = (c: number, r: number) => r * cols + c

  const targetTracks = Math.max(1, Math.round(((cols * rows) / 14) * Math.max(0, density)))
  // Tramos largos: el alcance permite recorrer buena parte de la grilla.
  const maxReach = Math.max(8, Math.floor(Math.max(cols, rows) * 1.6))

  // Elige la próxima dirección de avance desde (c,r): favorece seguir recto, y
  // si la celda preferida está bloqueada gira 90° para *rodear* el obstáculo en
  // vez de cortar la pista (continuidad). Devuelve null solo si está encerrada.
  const nextDir = (c: number, r: number, dir: number): number | null => {
    const perps = dir < 2 ? [2, 3] : [0, 1]
    let order: number[]
    if (rng() > STRAIGHT_BIAS) {
      const turn = pick(rng, perps) ?? dir
      order = [turn, dir, perps[0] === turn ? perps[1] : perps[0]]
    } else {
      order = [dir, perps[0], perps[1]]
    }
    for (const nd of order) {
      const nc = c + DIRS[nd][0]
      const nr = r + DIRS[nd][1]
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue
      if (occupied.has(cellKey(nc, nr))) continue
      return nd
    }
    return null
  }

  for (let t = 0; t < targetTracks; t++) {
    const start = findFreeCell(rng, cols, rows, occupied, cellKey)
    if (!start) break
    let [c, r] = start
    let dir = int(rng, 0, 3)
    occupied.add(cellKey(c, r))

    const verts: Array<[number, number]> = [[c, r]]
    const maxLen = int(rng, Math.min(10, maxReach), maxReach)
    let steps = 0
    while (steps < maxLen) {
      const nd = nextDir(c, r, dir)
      if (nd === null) break // pista encerrada: termina
      if (nd !== dir) verts.push([c, r]) // esquina del giro (siempre 90°)
      c += DIRS[nd][0]
      r += DIRS[nd][1]
      occupied.add(cellKey(c, r))
      dir = nd
      steps++
    }
    verts.push([c, r])

    const poly = dedupe(verts).map(([vc, vr]) => toPx(vc, vr))
    if (poly.length >= 2) {
      tracks.push(poly)
      pads.push(poly[0], poly[poly.length - 1]) // terminaciones
    }
  }

  return { tracks, pads, cell: CELL }
}

/** Busca una celda libre al azar; null si no encuentra tras varios intentos. */
function findFreeCell(
  rng: Prng,
  cols: number,
  rows: number,
  occupied: Set<number>,
  cellKey: (c: number, r: number) => number,
): [number, number] | null {
  for (let tries = 0; tries < 24; tries++) {
    const c = int(rng, 0, cols - 1)
    const r = int(rng, 0, rows - 1)
    if (!occupied.has(cellKey(c, r))) return [c, r]
  }
  return null
}

/** Elimina vértices consecutivos repetidos (un giro en la celda inicial). */
function dedupe(verts: Array<[number, number]>): Array<[number, number]> {
  const out: Array<[number, number]> = []
  for (const v of verts) {
    const last = out[out.length - 1]
    if (!last || last[0] !== v[0] || last[1] !== v[1]) out.push(v)
  }
  return out
}
