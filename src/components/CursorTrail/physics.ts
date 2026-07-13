/*
 * Física pura de CursorTrail — sin DOM ni canvas, testeable de forma aislada.
 * Tres piezas: el emisor por umbral de distancia (compartido por ambos modos),
 * el pool de partículas del modo `particles` (vida/fade/deriva) y la geometría
 * del modo `line` (polyline con grosor/alpha decrecientes hacia la cola).
 */

export interface TrailPoint {
  x: number
  y: number
}

/**
 * Estado del emisor por distancia: acumula el recorrido del puntero y decide
 * dónde emitir. `last` es la última muestra vista (`null` al entrar/reingresar
 * al contenedor: la primera muestra solo ancla, no emite).
 */
export interface EmitterState {
  last: TrailPoint | null
  /** Distancia recorrida desde la última emisión, en px. */
  traveled: number
}

export function createEmitterState(): EmitterState {
  return { last: null, traveled: 0 }
}

/**
 * Avanza el emisor con una muestra nueva del puntero y retorna los puntos de
 * emisión: uno por cada múltiplo de `emitEvery` px que el recorrido acumulado
 * cruce, interpolado sobre el segmento (un movimiento rápido puede emitir
 * varios puntos equiespaciados; uno menor al umbral no emite ninguno). El
 * remanente se conserva para la muestra siguiente.
 */
export function advanceEmitter(
  state: EmitterState,
  x: number,
  y: number,
  emitEvery: number,
): TrailPoint[] {
  const last = state.last
  state.last = { x, y }
  if (!last) return []

  const dx = x - last.x
  const dy = y - last.y
  const dist = Math.hypot(dx, dy)
  if (dist === 0) return []

  const points: TrailPoint[] = []
  // Distancia dentro del segmento actual en la que cae la próxima emisión.
  let offset = emitEvery - state.traveled
  while (offset <= dist) {
    const t = offset / dist
    points.push({ x: last.x + dx * t, y: last.y + dy * t })
    offset += emitEvery
  }
  state.traveled = (state.traveled + dist) % emitEvery
  return points
}

/** Reinicia el emisor (el puntero salió del contenedor). */
export function resetEmitter(state: EmitterState): void {
  state.last = null
  state.traveled = 0
}

export interface TrailParticle {
  x: number
  y: number
  vx: number
  vy: number
  /** Vida restante en segundos; al llegar a 0 la partícula se descarta. */
  life: number
  /** Vida total, para derivar el alpha (`life / maxLife`). */
  maxLife: number
  /** Radio en px (con jitter por partícula). */
  radius: number
  color: string
}

/** Rango de la velocidad de deriva inicial en px/s. */
const DRIFT_SPEED = 30
/** Jitter del radio por partícula: `[0.5, 1]` del radio base. */
const RADIUS_JITTER = 0.5

export interface SpawnOptions {
  x: number
  y: number
  /** Diámetro base en px (el radio efectivo es la mitad, con jitter). */
  size: number
  /** Vida en segundos. */
  life: number
  /** Paleta: cada partícula toma un color al azar de acá. */
  colors: readonly string[]
  /** Fuente de aleatoriedad inyectable (tests deterministas). */
  random?: () => number
}

/**
 * Crea una partícula en el punto de emisión, con deriva aleatoria leve y
 * radio/color jittereados para que la estela no se vea mecánica.
 */
export function spawnParticle({
  x,
  y,
  size,
  life,
  colors,
  random = Math.random,
}: SpawnOptions): TrailParticle {
  const angle = random() * Math.PI * 2
  const speed = random() * DRIFT_SPEED
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life,
    maxLife: life,
    radius: (size / 2) * (1 - RADIUS_JITTER * random()),
    color: colors[Math.floor(random() * colors.length)] ?? '#7c3aed',
  }
}

/**
 * Avanza el pool un frame, mutándolo en su lugar: integra la deriva, decae la
 * vida y descarta (culling) las partículas agotadas. `dt` en segundos.
 */
export function stepTrailParticles(particles: TrailParticle[], dt: number): void {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.life -= dt
    if (p.life <= 0) {
      particles.splice(i, 1)
      continue
    }
    p.x += p.vx * dt
    p.y += p.vy * dt
  }
}

export interface LinePoint {
  x: number
  y: number
  /** Edad en segundos desde la emisión. */
  age: number
}

/**
 * Envejece los puntos de la línea un frame, mutando el array en su lugar y
 * descartando los que superan `maxAge`. `dt` en segundos.
 */
export function ageLinePoints(points: LinePoint[], dt: number, maxAge: number): void {
  for (let i = points.length - 1; i >= 0; i--) {
    points[i].age += dt
    if (points[i].age >= maxAge) points.splice(i, 1)
  }
}

export interface LineSegment {
  x1: number
  y1: number
  x2: number
  y2: number
  width: number
  alpha: number
}

/**
 * Geometría del modo `line`: convierte la polyline (puntos ordenados del más
 * viejo al más nuevo) en segmentos con grosor y alpha decrecientes hacia la
 * cola. El fade de cada segmento combina la posición en la polyline (la cola
 * afina) con la edad del punto (la línea entera se desvanece al detenerse el
 * puntero).
 */
export function lineSegments(
  points: readonly LinePoint[],
  size: number,
  maxAge: number,
): LineSegment[] {
  const segments: LineSegment[] = []
  const count = points.length
  for (let i = 0; i < count - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const position = (i + 1) / count // 1 en la cabeza, →0 hacia la cola
    const freshness = Math.max(0, 1 - a.age / maxAge)
    const fade = position * freshness
    if (fade <= 0) continue
    segments.push({
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      width: Math.max(0.5, size * fade),
      alpha: fade,
    })
  }
  return segments
}
