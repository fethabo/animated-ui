/*
 * Física pura de ConfettiBurst — sin DOM ni canvas, testeable de forma
 * aislada. El componente spawnea copos en cada `fire()`, avanza el pool un
 * paso por frame con `stepFlakes` (que además culléa los copos muertos,
 * mutando el array en su lugar) y dibuja el resultado; toda la matemática
 * vive acá. Toda la aleatoriedad entra por un `Prng` inyectado — sin
 * aleatoriedad ni reloj globales del runtime (restricción del paquete).
 */
import { pick, range, type Prng } from '../../utils/prng'
import type { ConfettiShape } from './types'

export interface Flake {
  x: number
  y: number
  /** Velocidad en px/frame. */
  vx: number
  vy: number
  /** Rotación 2D del copo en radianes (giro en el plano). */
  rotation: number
  rotationSpeed: number
  /**
   * Fase del tumbling: rotación 3D simulada escalando el eje menor del copo
   * con `cos(tumble)` (el rect "da vueltas" sobre sí mismo, el circle se
   * achata como una moneda).
   */
  tumble: number
  tumbleSpeed: number
  /** Lado mayor del copo en px. */
  size: number
  color: string
  shape: ConfettiShape
  /** Vida normalizada `1 → 0`; materializa el alpha y culléa al agotarse. */
  life: number
  /** Decaimiento de vida por frame (escalonado por copo). */
  decay: number
}

export interface SpawnOptions {
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
  /** Velocidad inicial máxima en px/frame (cada copo jittéa hacia abajo). */
  power: number
  colors: readonly string[]
  shapes: readonly ConfettiShape[]
  /** Fuente de aleatoriedad seedable (determinista por ráfaga). */
  rng: Prng
}

/** Jitter de velocidad inicial: cada copo sale con `power * [MIN, 1)`. */
const POWER_JITTER_MIN = 0.4
/** Rango del lado mayor del copo en px. */
const SIZE_MIN = 6
const SIZE_MAX = 12
/** Rango del decaimiento de vida por frame (≈70–160 frames de vida). */
const DECAY_MIN = 0.006
const DECAY_MAX = 0.014
/** Máxima velocidad de giro 2D en rad/frame. */
const ROTATION_SPEED_MAX = 0.2
/** Rango de velocidad del tumbling en rad/frame. */
const TUMBLE_SPEED_MIN = 0.08
const TUMBLE_SPEED_MAX = 0.3

/**
 * Crea los copos de una ráfaga: salen del `origin` en un abanico centrado en
 * `angle` con apertura `spread` (grados, `90` = hacia arriba en coordenadas
 * de canvas), con velocidad inicial `power` jittereada por copo. Color, forma,
 * tamaño, giro y vida se sortean con el `rng` inyectado — la misma seed
 * produce la misma ráfaga.
 */
export function spawnFlakes({
  count,
  width,
  height,
  origin,
  angle,
  spread,
  power,
  colors,
  shapes,
  rng,
}: SpawnOptions): Flake[] {
  const flakes: Flake[] = []
  const centerRad = (angle * Math.PI) / 180
  const spreadRad = (spread * Math.PI) / 180
  for (let i = 0; i < count; i++) {
    const direction = centerRad + (rng() - 0.5) * spreadRad
    const speed = power * range(rng, POWER_JITTER_MIN, 1)
    flakes.push({
      x: origin.x * width,
      y: origin.y * height,
      // Eje y del canvas crece hacia abajo: se invierte el seno para que
      // `angle=90` dispare hacia arriba.
      vx: Math.cos(direction) * speed,
      vy: -Math.sin(direction) * speed,
      rotation: rng() * Math.PI * 2,
      rotationSpeed: (rng() - 0.5) * 2 * ROTATION_SPEED_MAX,
      tumble: rng() * Math.PI * 2,
      tumbleSpeed: range(rng, TUMBLE_SPEED_MIN, TUMBLE_SPEED_MAX),
      size: range(rng, SIZE_MIN, SIZE_MAX),
      color: pick(rng, colors) ?? '#ffffff',
      shape: pick(rng, shapes) ?? 'rect',
      life: 1,
      decay: range(rng, DECAY_MIN, DECAY_MAX),
    })
  }
  return flakes
}

export interface StepFlakesOptions {
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
 * avanza giro y tumbling, decae la vida, y **culléa** (remueve del array) los
 * copos muertos — por vida agotada o por salir del área por abajo o por los
 * costados. Cuando el array queda vacío, el componente detiene su RAF.
 */
export function stepFlakes(flakes: Flake[], opts: StepFlakesOptions): void {
  const { width, height, gravity } = opts
  const drag = opts.drag ?? DEFAULT_DRAG
  for (let i = flakes.length - 1; i >= 0; i--) {
    const f = flakes[i]
    f.vy += gravity
    f.vx *= drag
    f.vy *= drag
    f.x += f.vx
    f.y += f.vy
    f.rotation += f.rotationSpeed
    f.tumble += f.tumbleSpeed
    f.life -= f.decay
    const gone =
      f.life <= 0 || f.y - f.size > height || f.x + f.size < 0 || f.x - f.size > width
    if (gone) flakes.splice(i, 1)
  }
}
