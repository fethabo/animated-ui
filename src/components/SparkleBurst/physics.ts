/*
 * Física pura de SparkleBurst — sin DOM ni canvas, testeable de forma
 * aislada. Los destellos no se desplazan: titilan en su lugar alrededor del
 * origen, con aparición escalonada (`delay`), envolvente de escala que crece
 * rápido y se encoge (`sparkleScale`) y rotación individual. La geometría de
 * la estrella de 4 puntas también vive acá (design de Wave J, decisión 3:
 * path determinista, no glifos de fuente). Toda la aleatoriedad entra por un
 * `Prng` inyectado.
 */
import { pick, range, type Prng } from '../../utils/prng'

export interface Sparkle {
  x: number
  y: number
  /** Rotación de la estrella en radianes. */
  rotation: number
  rotationSpeed: number
  /** Radio exterior máximo de la estrella en px. */
  size: number
  color: string
  /** Frames restantes antes de aparecer (twinkle escalonado). */
  delay: number
  /** Frames vividos desde que apareció. */
  age: number
  /** Frames totales de vida. */
  lifespan: number
}

export interface SpawnSparklesOptions {
  count: number
  /** Dimensiones del área en px CSS. */
  width: number
  height: number
  /** Centro de la dispersión, relativo al área (`0–1` por eje). */
  origin: { x: number; y: number }
  /** Radio de dispersión alrededor del origen, en px. */
  spread: number
  /** Radio exterior máximo de cada estrella, en px. */
  size: number
  /** Vida total de cada destello, en frames. */
  lifespan: number
  colors: readonly string[]
  /** Fuente de aleatoriedad seedable (determinista por ráfaga). */
  rng: Prng
}

/** Jitter del tamaño por destello: `size * [MIN, 1)`. */
const SIZE_JITTER_MIN = 0.5
/** Jitter de la vida por destello: `lifespan * [MIN, 1)`. */
const LIFESPAN_JITTER_MIN = 0.6
/** Fracción de la vida sobre la que se escalona la aparición. */
const DELAY_SPAN = 0.6
/** Máxima velocidad de giro en rad/frame. */
const ROTATION_SPEED_MAX = 0.06
/** Fracción inicial de la vida en que la estrella crece (después se encoge). */
const GROW_PHASE = 0.25

/**
 * Crea los destellos de una ráfaga dispersos uniformemente en un disco de
 * radio `spread` alrededor del origen, con tamaño, vida, giro y delay de
 * aparición sorteados con el `rng` inyectado — la misma seed produce la
 * misma ráfaga.
 */
export function spawnSparkles({
  count,
  width,
  height,
  origin,
  spread,
  size,
  lifespan,
  colors,
  rng,
}: SpawnSparklesOptions): Sparkle[] {
  const sparkles: Sparkle[] = []
  const cx = origin.x * width
  const cy = origin.y * height
  for (let i = 0; i < count; i++) {
    // Distribución uniforme en el disco (sqrt evita concentrarse en el centro).
    const r = spread * Math.sqrt(rng())
    const theta = rng() * Math.PI * 2
    sparkles.push({
      x: cx + Math.cos(theta) * r,
      y: cy + Math.sin(theta) * r,
      rotation: rng() * Math.PI * 2,
      rotationSpeed: (rng() - 0.5) * 2 * ROTATION_SPEED_MAX,
      size: size * range(rng, SIZE_JITTER_MIN, 1),
      color: pick(rng, colors) ?? '#ffffff',
      delay: Math.round(rng() * lifespan * DELAY_SPAN),
      age: 0,
      lifespan: Math.max(1, Math.round(lifespan * range(rng, LIFESPAN_JITTER_MIN, 1))),
    })
  }
  return sparkles
}

/**
 * Envolvente de escala/alpha por vida normalizada `t = age/lifespan`:
 * crece rápido hasta `GROW_PHASE` y se encoge suavemente hasta morir.
 * Retorna `0–1`.
 */
export function sparkleScale(t: number): number {
  if (t <= 0) return 0
  if (t >= 1) return 0
  if (t < GROW_PHASE) return t / GROW_PHASE
  return 1 - (t - GROW_PHASE) / (1 - GROW_PHASE)
}

/**
 * Avanza el pool un frame, mutándolo en su lugar: consume el `delay` de
 * aparición, envejece y gira los destellos activos, y **culléa** los que
 * agotaron su vida. Cuando el array queda vacío, el componente detiene su RAF.
 */
export function stepSparkles(sparkles: Sparkle[]): void {
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i]
    if (s.delay > 0) {
      s.delay--
      continue
    }
    s.age++
    s.rotation += s.rotationSpeed
    if (s.age >= s.lifespan) sparkles.splice(i, 1)
  }
}

/** Un punto 2D de la geometría de la estrella. */
export interface StarPoint {
  x: number
  y: number
}

/** Relación cintura/punta de la estrella de 4 puntas. */
const INNER_RATIO = 0.28

/**
 * Geometría de la estrella de 4 puntas: retorna las 4 puntas (`tips`) y los
 * 4 puntos de cintura (`waists`) intercalados; `waists[i]` es el punto de
 * control entre `tips[i]` y `tips[(i+1) % 4]` (dibujable con
 * `quadraticCurveTo`). Pura y determinista: solo depende de `outerRadius`.
 */
export function starGeometry(outerRadius: number): { tips: StarPoint[]; waists: StarPoint[] } {
  const inner = outerRadius * INNER_RATIO
  const tips: StarPoint[] = []
  const waists: StarPoint[] = []
  for (let i = 0; i < 4; i++) {
    const tipAngle = -Math.PI / 2 + (i * Math.PI) / 2
    const waistAngle = tipAngle + Math.PI / 4
    tips.push({ x: Math.cos(tipAngle) * outerRadius, y: Math.sin(tipAngle) * outerRadius })
    waists.push({ x: Math.cos(waistAngle) * inner, y: Math.sin(waistAngle) * inner })
  }
  return { tips, waists }
}
