/*
 * Física pura de ClickSpark — sin DOM ni canvas, testeable de forma aislada.
 * Chispas radiales cortas: segmentos que salen disparados desde el punto de
 * click con distribución angular pareja (más jitter leve), se frenan con drag
 * y se desvanecen rápido. Toda la aleatoriedad entra por un `Prng` inyectado.
 */
import { pick, range, type Prng } from '../../utils/prng'

export interface ClickSparkParticle {
  x: number
  y: number
  /** Velocidad en px/frame. */
  vx: number
  vy: number
  /** Largo del segmento de chispa en px (escala con la vida). */
  size: number
  color: string
  /** Vida normalizada `1 → 0`; materializa alpha/largo y culléa al agotarse. */
  life: number
  decay: number
}

export interface SpawnSparksOptions {
  count: number
  /** Punto de origen en px (coordenadas del área). */
  origin: { x: number; y: number }
  /** Alcance aproximado de la ráfaga en px. */
  radius: number
  /** Largo base del segmento de chispa en px. */
  size: number
  /** Vida total aproximada en frames (define el decay). */
  lifespan: number
  colors: readonly string[]
  /** Fuente de aleatoriedad seedable (determinista por ráfaga). */
  rng: Prng
}

/** Jitter angular alrededor de la distribución pareja, en radianes. */
const ANGLE_JITTER = 0.5
/** Jitter de velocidad por chispa: `speed * [MIN, 1)`. */
const SPEED_JITTER_MIN = 0.55
/** Jitter del largo por chispa: `size * [MIN, MAX)`. */
const SIZE_JITTER_MIN = 0.6
const SIZE_JITTER_MAX = 1.2
/** Jitter de la vida por chispa: `lifespan * [MIN, 1)`. */
const LIFESPAN_JITTER_MIN = 0.65
/**
 * Fracción del recorrido total (integral geométrica del drag) que fija la
 * velocidad inicial para que la chispa recorra ~`radius` px antes de frenarse.
 */
const DEFAULT_DRAG = 0.88

/**
 * Crea las chispas de un click: distribución angular pareja alrededor del
 * punto (con jitter), velocidad inicial calculada para que el alcance
 * aproximado sea `radius`, y vida corta jittereada. La misma seed produce la
 * misma ráfaga.
 */
export function spawnSparks({
  count,
  origin,
  radius,
  size,
  lifespan,
  colors,
  rng,
}: SpawnSparksOptions): ClickSparkParticle[] {
  const sparks: ClickSparkParticle[] = []
  // Con drag multiplicativo `d`, el recorrido total ≈ v0 * d / (1 - d):
  // se despeja v0 para que el alcance sea ~radius.
  const v0 = (radius * (1 - DEFAULT_DRAG)) / DEFAULT_DRAG
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (rng() - 0.5) * ANGLE_JITTER
    const speed = v0 * range(rng, SPEED_JITTER_MIN, 1)
    sparks.push({
      x: origin.x,
      y: origin.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: size * range(rng, SIZE_JITTER_MIN, SIZE_JITTER_MAX),
      color: pick(rng, colors) ?? '#ffffff',
      life: 1,
      decay: 1 / Math.max(1, lifespan * range(rng, LIFESPAN_JITTER_MIN, 1)),
    })
  }
  return sparks
}

export interface StepSparksOptions {
  /** Fricción multiplicativa de la velocidad por frame. Default: `0.88`. */
  drag?: number
}

/**
 * Avanza el pool un frame, mutándolo en su lugar: integra el drag (las
 * chispas se frenan, no caen — no hay gravedad en un click), decae la vida y
 * **culléa** las chispas muertas. Cuando el array queda vacío, el componente
 * detiene su RAF.
 */
export function stepSparks(sparks: ClickSparkParticle[], opts: StepSparksOptions = {}): void {
  const drag = opts.drag ?? DEFAULT_DRAG
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i]
    s.vx *= drag
    s.vy *= drag
    s.x += s.vx
    s.y += s.vy
    s.life -= s.decay
    if (s.life <= 0) sparks.splice(i, 1)
  }
}
