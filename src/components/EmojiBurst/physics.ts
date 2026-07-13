/*
 * Física pura de EmojiBurst — sin DOM ni canvas, testeable de forma aislada.
 * Misma familia que la física de confetti (abanico `angle`/`spread`/`power`,
 * gravedad, drag, fade por vida) pero con partículas-emoji: el tumbling 3D de
 * los papelitos se reemplaza por rotación 2D simple (design de Wave J,
 * decisión 4). Toda la aleatoriedad entra por un `Prng` inyectado.
 */
import { pick, range, type Prng } from '../../utils/prng'

export interface EmojiParticle {
  x: number
  y: number
  /** Velocidad en px/frame. */
  vx: number
  vy: number
  /** Rotación 2D en radianes. */
  rotation: number
  rotationSpeed: number
  /** El glifo a renderizar con `fillText`. */
  emoji: string
  /** Tamaño de fuente en px. */
  size: number
  /** Vida normalizada `1 → 0`; materializa el alpha y culléa al agotarse. */
  life: number
  decay: number
}

export interface SpawnEmojisOptions {
  count: number
  /** Dimensiones del área en px CSS. */
  width: number
  height: number
  /** Origen de la ráfaga, relativo al área (`0–1` por eje). */
  origin: { x: number; y: number }
  /** Dirección central del abanico en grados; `90` apunta hacia arriba. */
  angle: number
  /** Apertura total del cono en grados. */
  spread: number
  /** Velocidad inicial máxima en px/frame (cada emoji jittéa hacia abajo). */
  power: number
  /** Tamaño de fuente base en px (cada emoji jittéa alrededor). */
  size: number
  /** Lista de la que cada partícula sortea su emoji. */
  emojis: readonly string[]
  /** Fuente de aleatoriedad seedable (determinista por ráfaga). */
  rng: Prng
}

/** Jitter de velocidad inicial: cada emoji sale con `power * [MIN, 1)`. */
const POWER_JITTER_MIN = 0.4
/** Jitter del tamaño por emoji: `size * [MIN, MAX)`. */
const SIZE_JITTER_MIN = 0.75
const SIZE_JITTER_MAX = 1.25
/** Rango del decaimiento de vida por frame (≈70–160 frames de vida). */
const DECAY_MIN = 0.006
const DECAY_MAX = 0.014
/** Máxima velocidad de giro 2D en rad/frame. */
const ROTATION_SPEED_MAX = 0.12

/**
 * Crea las partículas de una ráfaga: salen del `origin` en un abanico
 * centrado en `angle` con apertura `spread` (grados, `90` = hacia arriba en
 * coordenadas de canvas), con velocidad inicial `power` jittereada. Emoji,
 * tamaño, giro y vida se sortean con el `rng` inyectado — la misma seed
 * produce la misma ráfaga.
 */
export function spawnEmojis({
  count,
  width,
  height,
  origin,
  angle,
  spread,
  power,
  size,
  emojis,
  rng,
}: SpawnEmojisOptions): EmojiParticle[] {
  const particles: EmojiParticle[] = []
  const centerRad = (angle * Math.PI) / 180
  const spreadRad = (spread * Math.PI) / 180
  for (let i = 0; i < count; i++) {
    const direction = centerRad + (rng() - 0.5) * spreadRad
    const speed = power * range(rng, POWER_JITTER_MIN, 1)
    particles.push({
      x: origin.x * width,
      y: origin.y * height,
      // Eje y del canvas crece hacia abajo: se invierte el seno para que
      // `angle=90` dispare hacia arriba.
      vx: Math.cos(direction) * speed,
      vy: -Math.sin(direction) * speed,
      rotation: (rng() - 0.5) * Math.PI, // arranca casi derecho, no boca abajo
      rotationSpeed: (rng() - 0.5) * 2 * ROTATION_SPEED_MAX,
      emoji: pick(rng, emojis) ?? '🎉',
      size: size * range(rng, SIZE_JITTER_MIN, SIZE_JITTER_MAX),
      life: 1,
      decay: range(rng, DECAY_MIN, DECAY_MAX),
    })
  }
  return particles
}

export interface StepEmojisOptions {
  /** Dimensiones del área en px CSS (para el culling por salida). */
  width: number
  height: number
  /** Aceleración vertical en px/frame² (positiva = cae). */
  gravity: number
  /** Fricción multiplicativa de la velocidad por frame. Default: `0.985`. */
  drag?: number
}

const DEFAULT_DRAG = 0.985

/**
 * Avanza el pool un frame, mutándolo en su lugar: integra gravedad y drag,
 * avanza el giro, decae la vida, y **culléa** (remueve del array) las
 * partículas muertas — por vida agotada o por salir del área por abajo o por
 * los costados. Cuando el array queda vacío, el componente detiene su RAF.
 */
export function stepEmojis(particles: EmojiParticle[], opts: StepEmojisOptions): void {
  const { width, height, gravity } = opts
  const drag = opts.drag ?? DEFAULT_DRAG
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.vy += gravity
    p.vx *= drag
    p.vy *= drag
    p.x += p.vx
    p.y += p.vy
    p.rotation += p.rotationSpeed
    p.life -= p.decay
    const gone =
      p.life <= 0 || p.y - p.size > height || p.x + p.size < 0 || p.x - p.size > width
    if (gone) particles.splice(i, 1)
  }
}
