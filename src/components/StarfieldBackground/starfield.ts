/*
 * Generación pura del campo de estrellas y de las fugaces — sin DOM ni canvas,
 * testeable de forma aislada. Todo determinista via `createPrng`: la seed del
 * campo incluye las dimensiones, así el resize regenera un cielo distinto pero
 * reproducible (misma seed + mismo tamaño ⇒ mismo cielo).
 */
import { createPrng, pick, range, type Prng } from '../../utils/prng'

export interface Star {
  x: number
  y: number
  /** Radio en px. */
  radius: number
  /** Fase inicial del titileo en radianes (asíncrono entre estrellas). */
  phase: number
  /** Multiplicador de la frecuencia de titileo propio de la estrella. */
  twinkleSpeed: number
  color: string
}

/** Estrellas por cada 10.000 px² a `density = 1`. */
const STARS_PER_10K = 2.5

export interface CreateStarfieldOptions {
  width: number
  height: number
  /** Multiplicador de la densidad base. */
  density: number
  colors: readonly string[]
  seed: string | number
}

/**
 * Genera el campo de estrellas (posiciones, radios, fases y colores) de forma
 * determinista: misma `seed` + mismas dimensiones producen el mismo cielo, y
 * un cambio de tamaño regenera un campo nuevo igualmente reproducible.
 */
export function createStarfield({
  width,
  height,
  density,
  colors,
  seed,
}: CreateStarfieldOptions): Star[] {
  const rng = createPrng(`${seed}:${width}x${height}`)
  const count = Math.max(1, Math.round(((width * height) / 10_000) * STARS_PER_10K * density))
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rng() * width,
      y: rng() * height,
      radius: range(rng, 0.4, 1.4),
      phase: rng() * Math.PI * 2,
      twinkleSpeed: range(rng, 0.5, 1.5),
      color: pick(rng, colors) ?? '#ffffff',
    })
  }
  return stars
}

export interface ShootingStar {
  x: number
  y: number
  /** Velocidad en px/s. */
  vx: number
  vy: number
  /** Vida restante en segundos; al agotarse la fugaz se descarta. */
  life: number
  maxLife: number
}

/** Rango de velocidad de las fugaces en px/s. */
const SHOOTING_SPEED_MIN = 320
const SHOOTING_SPEED_MAX = 640
/** Rango de vida de las fugaces en segundos. */
const SHOOTING_LIFE_MIN = 0.5
const SHOOTING_LIFE_MAX = 1.1
/** Inclinación de la trayectoria respecto de la horizontal, en radianes. */
const SHOOTING_TILT_MIN = Math.PI / 9 // 20°
const SHOOTING_TILT_MAX = Math.PI / 4.5 // 40°

/**
 * Crea una estrella fugaz con spawn en el tercio superior del canvas y
 * trayectoria diagonal descendente (dirección horizontal aleatoria), usando el
 * PRNG del componente.
 */
export function spawnShootingStar(rng: Prng, width: number, height: number): ShootingStar {
  const tilt = range(rng, SHOOTING_TILT_MIN, SHOOTING_TILT_MAX)
  const direction = rng() < 0.5 ? -1 : 1
  const speed = range(rng, SHOOTING_SPEED_MIN, SHOOTING_SPEED_MAX)
  const life = range(rng, SHOOTING_LIFE_MIN, SHOOTING_LIFE_MAX)
  return {
    x: rng() * width,
    y: rng() * height * 0.33,
    vx: Math.cos(tilt) * speed * direction,
    vy: Math.sin(tilt) * speed,
    life,
    maxLife: life,
  }
}

/**
 * Avanza las fugaces un frame, mutando el array en su lugar: integra la
 * trayectoria, decae la vida y descarta las agotadas. `dt` en segundos.
 */
export function stepShootingStars(stars: ShootingStar[], dt: number): void {
  for (let i = stars.length - 1; i >= 0; i--) {
    const s = stars[i]
    s.life -= dt
    if (s.life <= 0) {
      stars.splice(i, 1)
      continue
    }
    s.x += s.vx * dt
    s.y += s.vy * dt
  }
}
