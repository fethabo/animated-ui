/*
 * Física pura de FireworksBurst — sin DOM ni canvas, testeable de forma
 * aislada. Un solo pool tipado por fase (design de Wave J, decisión 2): cada
 * cohete (`rocket`) asciende con un wobble lateral y, al agotar su impulso
 * (apex), se reemplaza in-place por sus chispas (`spark`) radiales con
 * gravedad, drag y fade. Toda la aleatoriedad entra por un `Prng` inyectado —
 * sin aleatoriedad ni reloj globales del runtime (restricción del paquete).
 */
import { pick, range, type Prng } from '../../utils/prng'

export interface Rocket {
  kind: 'rocket'
  x: number
  y: number
  /** Velocidad en px/frame (vy negativa = asciende). */
  vx: number
  vy: number
  /** Frames restantes antes del despegue (lanzamiento escalonado). */
  delay: number
  /** Wobble lateral del ascenso (fase/velocidad/amplitud del seno). */
  wobblePhase: number
  wobbleSpeed: number
  wobbleAmp: number
  /** Color base de su explosión. */
  color: string
  /** Cantidad de chispas que libera al explotar. */
  sparkCount: number
  /** Potencia de la explosión (escala las velocidades radiales). */
  burstPower: number
}

export interface Spark {
  kind: 'spark'
  x: number
  y: number
  vx: number
  vy: number
  color: string
  /** Radio de la chispa en px. */
  size: number
  /** Vida normalizada `1 → 0`; materializa el alpha y culléa al agotarse. */
  life: number
  decay: number
}

export type Firework = Rocket | Spark

export interface SpawnRocketsOptions {
  /** Cohetes de la ráfaga. */
  rockets: number
  /** Chispas por explosión. */
  particleCount: number
  /** Dimensiones del área en px CSS. */
  width: number
  height: number
  /** Base de lanzamiento, relativa al área (`0–1` por eje). */
  origin: { x: number; y: number }
  /** Velocidad inicial de ascenso en px/frame. */
  power: number
  colors: readonly string[]
  /** Fuente de aleatoriedad seedable (determinista por ráfaga). */
  rng: Prng
}

/** Jitter de la velocidad de ascenso: cada cohete sale con `power * [MIN, MAX)`. */
const ASCENT_JITTER_MIN = 0.85
const ASCENT_JITTER_MAX = 1.1
/** Deriva horizontal máxima del cohete en px/frame. */
const ROCKET_VX_MAX = 0.6
/** Frames de separación entre lanzamientos consecutivos. */
const STAGGER_MIN = 6
const STAGGER_MAX = 16
/** Wobble lateral del ascenso. */
const WOBBLE_SPEED_MIN = 0.15
const WOBBLE_SPEED_MAX = 0.35
const WOBBLE_AMP_MAX = 0.8
/** Fracción de `power` que escala las velocidades radiales de la explosión. */
const BURST_POWER_FACTOR = 0.45
/** Jitter de velocidad radial por chispa: `burstPower * [MIN, 1)`. */
const SPARK_SPEED_JITTER_MIN = 0.25
/** Radio de la chispa en px. */
const SPARK_SIZE_MIN = 1.5
const SPARK_SIZE_MAX = 3
/** Rango del decaimiento de vida por frame (≈60–140 frames de vida). */
const SPARK_DECAY_MIN = 0.007
const SPARK_DECAY_MAX = 0.016
/** Probabilidad de que una chispa sea blanca (núcleo brillante). */
const WHITE_SPARK_CHANCE = 0.15
/** El cohete explota cuando su impulso ascendente cae por debajo de esto. */
const APEX_VY = -0.5

/**
 * Crea los cohetes de una ráfaga: parten de `origin` (default: base del
 * contenedor) con impulso vertical `power` jittereado, deriva horizontal
 * leve y despegue escalonado por cohete. Color, wobble y potencia de
 * explosión se sortean con el `rng` inyectado — la misma seed produce la
 * misma ráfaga.
 */
export function spawnRockets({
  rockets,
  particleCount,
  width,
  height,
  origin,
  power,
  colors,
  rng,
}: SpawnRocketsOptions): Firework[] {
  const pool: Firework[] = []
  let delay = 0
  for (let i = 0; i < rockets; i++) {
    pool.push({
      kind: 'rocket',
      x: origin.x * width,
      y: origin.y * height,
      vx: (rng() - 0.5) * 2 * ROCKET_VX_MAX,
      vy: -power * range(rng, ASCENT_JITTER_MIN, ASCENT_JITTER_MAX),
      delay,
      wobblePhase: rng() * Math.PI * 2,
      wobbleSpeed: range(rng, WOBBLE_SPEED_MIN, WOBBLE_SPEED_MAX),
      wobbleAmp: rng() * WOBBLE_AMP_MAX,
      color: pick(rng, colors) ?? '#ffffff',
      sparkCount: particleCount,
      burstPower: power * BURST_POWER_FACTOR,
    })
    delay += Math.round(range(rng, STAGGER_MIN, STAGGER_MAX))
  }
  return pool
}

export interface StepFireworksOptions {
  /** Dimensiones del área en px CSS (para el culling por salida). */
  width: number
  height: number
  /** Aceleración vertical en px/frame² (positiva = frena el ascenso / cae). */
  gravity: number
  /**
   * Fuente de aleatoriedad de la ráfaga: genera las chispas de cada
   * explosión (determinista si es el mismo `rng` del spawn).
   */
  rng: Prng
  /** Fricción multiplicativa de la velocidad de las chispas por frame. Default: `0.98`. */
  drag?: number
}

const DEFAULT_DRAG = 0.98

/** Reemplaza el cohete por sus chispas radiales (explosión en el apex). */
function explode(pool: Firework[], index: number, rng: Prng): void {
  const r = pool[index] as Rocket
  const sparks: Spark[] = []
  for (let i = 0; i < r.sparkCount; i++) {
    const direction = rng() * Math.PI * 2
    const speed = r.burstPower * range(rng, SPARK_SPEED_JITTER_MIN, 1)
    sparks.push({
      kind: 'spark',
      x: r.x,
      y: r.y,
      vx: Math.cos(direction) * speed,
      vy: Math.sin(direction) * speed,
      color: rng() < WHITE_SPARK_CHANCE ? '#ffffff' : r.color,
      size: range(rng, SPARK_SIZE_MIN, SPARK_SIZE_MAX),
      life: 1,
      decay: range(rng, SPARK_DECAY_MIN, SPARK_DECAY_MAX),
    })
  }
  pool.splice(index, 1, ...sparks)
}

/**
 * Avanza el pool un frame, mutándolo en su lugar. Cohetes: esperan su
 * `delay`, ascienden frenados por la gravedad con wobble lateral y explotan
 * al llegar al apex (impulso agotado), reemplazándose por sus chispas.
 * Chispas: integran gravedad y drag, decaen la vida y se cullean al morir o
 * salir del área. Cuando el array queda vacío, el componente detiene su RAF.
 */
export function stepFireworks(pool: Firework[], opts: StepFireworksOptions): void {
  const { width, height, gravity, rng } = opts
  const drag = opts.drag ?? DEFAULT_DRAG
  for (let i = pool.length - 1; i >= 0; i--) {
    const p = pool[i]
    if (p.kind === 'rocket') {
      if (p.delay > 0) {
        p.delay--
        continue
      }
      p.vy += gravity
      p.wobblePhase += p.wobbleSpeed
      p.x += p.vx + Math.sin(p.wobblePhase) * p.wobbleAmp
      p.y += p.vy
      // Apex: el impulso ascendente se agotó → explota acá.
      if (p.vy >= APEX_VY) explode(pool, i, rng)
      continue
    }
    p.vy += gravity
    p.vx *= drag
    p.vy *= drag
    p.x += p.vx
    p.y += p.vy
    p.life -= p.decay
    const gone =
      p.life <= 0 || p.y - p.size > height || p.x + p.size < 0 || p.x - p.size > width
    if (gone) pool.splice(i, 1)
  }
}
