/*
 * Física pura de ParticleField — sin DOM ni canvas, testeable de forma
 * aislada. El componente instancia el array, lo avanza un paso por frame con
 * `stepParticles`, y dibuja el resultado; toda la matemática vive acá.
 */
import type { CursorInteraction, DriftMode } from './types'

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  /**
   * Vida normalizada en `[0, 1]`, usada solo por `drift='embers'` para el
   * desvanecimiento (1 = recién nacida/opaca, 0 = apagada → reingresa). Los
   * demás modos la ignoran y la dejan `undefined`.
   */
  life?: number
}

export interface CreateParticlesOptions {
  count: number
  width: number
  height: number
  /** Rango de la velocidad inicial aleatoria en px/frame. */
  speed: number
  /** Modo de deriva: condiciona la velocidad inicial y si se inicializa `life`. Default: `'bounce'`. */
  drift?: DriftMode
  /** Fuente de aleatoriedad inyectable (tests deterministas). Default: `Math.random`. */
  random?: () => number
}

/**
 * Crea `count` partículas con posición aleatoria dentro de `[0, width] ×
 * [0, height]`. En `'bounce'` (default) la velocidad es aleatoria en
 * `[-speed, speed]` por eje (comportamiento original). En los modos
 * direccionales la velocidad inicial apunta hacia la dirección dominante del
 * modo, y `'embers'` inicializa además una `life` aleatoria para que las brasas
 * no se desvanezcan todas a la vez.
 */
export function createParticles({
  count,
  width,
  height,
  speed,
  drift = 'bounce',
  random = Math.random,
}: CreateParticlesOptions): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    const p: Particle = {
      x: random() * width,
      y: random() * height,
      vx: (random() * 2 - 1) * speed,
      vy: (random() * 2 - 1) * speed,
    }
    if (drift === 'snow') {
      p.vy = random() * speed // cae hacia abajo
    } else if (drift === 'embers') {
      p.vy = -random() * speed // sube
      p.life = random() // vidas escalonadas
    } else if (drift === 'bubbles') {
      p.vy = -random() * speed // sube
    }
    particles.push(p)
  }
  return particles
}

/** Escala que convierte la proximidad normalizada en aceleración por frame. */
const FORCE_SCALE = 0.6

/**
 * Fuerza cursor-a-partícula para el punto `(px, py)`. Retorna `{fx, fy}` a
 * sumar a la velocidad. Fuera del radio, sin cursor o con `mode='none'` la
 * fuerza es cero. La magnitud crece cuadráticamente con la proximidad
 * (más fuerte cuanto más cerca del cursor). `'repel'` empuja en dirección
 * contraria al cursor; `'attract'`, hacia él.
 */
export function cursorForce(
  px: number,
  py: number,
  cursor: { x: number; y: number },
  cursorRadius: number,
  mode: CursorInteraction,
): { fx: number; fy: number } {
  if (mode === 'none' || cursorRadius <= 0) return { fx: 0, fy: 0 }
  const dx = px - cursor.x
  const dy = py - cursor.y
  const dist = Math.hypot(dx, dy)
  if (dist >= cursorRadius || dist === 0) return { fx: 0, fy: 0 }

  const proximity = 1 - dist / cursorRadius // 1 en el cursor, 0 en el borde
  const strength = proximity * proximity * FORCE_SCALE
  const sign = mode === 'repel' ? 1 : -1
  return {
    fx: (dx / dist) * strength * sign,
    fy: (dy / dist) * strength * sign,
  }
}

export interface StepOptions {
  width: number
  height: number
  /** Posición del cursor relativa al canvas, o `null` si está afuera/touch. */
  cursor: { x: number; y: number } | null
  cursorRadius: number
  cursorInteraction: CursorInteraction
  /** Radio de la partícula (para que rebote sin salirse a medias). */
  radius: number
  /** Velocidad máxima por eje tras aplicar fuerzas, para que no explote. Default: `speed * 6`. */
  maxSpeed: number
  /** Modo de deriva. Default: `'bounce'` (rebote en bordes, velocidad persistente). */
  drift?: DriftMode
  /**
   * Velocidad base del modo (px/frame); fija la velocidad terminal de la
   * deriva en los modos direccionales. Default: `maxSpeed / 6`.
   */
  speed?: number
}

/** Frecuencia del bamboleo horizontal (sway) en función de la altura. */
const SWAY_FREQ = 0.02
/** Factor de relajación de la velocidad hacia la velocidad terminal del modo. */
const DRIFT_APPROACH = 0.05
/** Decaimiento de vida por frame en `embers` (≈250 frames de vida). */
const EMBER_DECAY = 0.004
/** `warp`: caída base (en el borde superior) como múltiplo de `speed`. */
const WARP_FALL_BASE = 0.6
/** `warp`: ganancia de la caída con la profundidad (perspectiva: más abajo = más rápido). */
const WARP_FALL_GAIN = 3
/** `warp`: apertura horizontal hacia los costados, que crece con la profundidad. */
const WARP_SPREAD_GAIN = 4

/**
 * Hash determinista en `[0, 1)` a partir de una semilla — distribuye los
 * reingresos de `warp` a lo ancho de todo el plano superior sin depender de
 * `Math.random` (mantiene `stepParticles` puro y reproducible).
 */
function hash01(seed: number): number {
  const s = Math.sin(seed) * 43758.5453
  return s - Math.floor(s)
}

/**
 * Ajusta la velocidad de una partícula hacia la velocidad terminal del modo de
 * deriva (relajación suave, para que la fuerza del cursor desplace de forma
 * transitoria y la partícula vuelva al flujo). En `embers` decae la vida y, al
 * agotarse, reingresa la partícula desde abajo con vida plena. En `warp` las
 * estrellas nacen a lo ancho de todo el borde superior y, en perspectiva,
 * aceleran hacia abajo y se abren hacia los costados a medida que descienden.
 * No toca nada en `'bounce'` (la velocidad persiste, como en el comportamiento
 * original).
 */
function applyDrift(p: Particle, drift: DriftMode, speed: number, width: number, height: number): void {
  if (drift === 'bounce') return

  if (drift === 'warp') {
    const cx = width / 2
    // Profundidad normalizada: 0 en el borde superior, crece hacia abajo.
    const depth = height > 0 ? Math.max(0, p.y) / height : 0
    // Cae acelerando con la profundidad (perspectiva: más cerca = más rápido).
    p.vy = speed * (WARP_FALL_BASE + depth * WARP_FALL_GAIN)
    // Se abre hacia los costados según cuán lejos del centro esté y la profundidad.
    p.vx = (cx > 0 ? (p.x - cx) / cx : 0) * speed * depth * WARP_SPREAD_GAIN
    return
  }

  const sway = Math.sin(p.y * SWAY_FREQ) * speed
  let tvx = 0
  let tvy = 0
  if (drift === 'snow') {
    tvx = sway * 0.6
    tvy = speed * 1.5
  } else if (drift === 'embers') {
    tvx = sway * 0.4
    tvy = -speed * 1.5
    p.life = (p.life ?? 1) - EMBER_DECAY
    if (p.life <= 0) {
      // Reingreso desde abajo con vida plena (el draw usa `life` como alpha).
      p.life = 1
      p.y = height
    }
  } else if (drift === 'bubbles') {
    tvx = sway * 1.2
    tvy = -speed * 1.8
  }
  p.vx += (tvx - p.vx) * DRIFT_APPROACH
  p.vy += (tvy - p.vy) * DRIFT_APPROACH
}

/**
 * Avanza el array de partículas un frame, mutándolo en su lugar: aplica la
 * deriva del modo y la fuerza del cursor, clampea la velocidad, integra la
 * posición y trata los bordes según el modo — `'bounce'` rebota invirtiendo la
 * velocidad (comportamiento original); los modos direccionales reingresan por
 * el borde opuesto (wrap).
 */
export function stepParticles(particles: Particle[], opts: StepOptions): void {
  const { width, height, cursor, cursorRadius, cursorInteraction, radius, maxSpeed } = opts
  const drift = opts.drift ?? 'bounce'
  const speed = opts.speed ?? maxSpeed / 6

  for (const p of particles) {
    applyDrift(p, drift, speed, width, height)

    if (cursor && cursorInteraction !== 'none') {
      const { fx, fy } = cursorForce(p.x, p.y, cursor, cursorRadius, cursorInteraction)
      p.vx += fx
      p.vy += fy
    }

    // Clamp de velocidad para que la repulsión acumulada no diverja.
    p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx))
    p.vy = Math.max(-maxSpeed, Math.min(maxSpeed, p.vy))

    p.x += p.vx
    p.y += p.vy

    if (drift === 'bounce') {
      // Rebote en bordes: reposiciona dentro del área e invierte la velocidad.
      if (p.x < radius) {
        p.x = radius
        p.vx = Math.abs(p.vx)
      } else if (p.x > width - radius) {
        p.x = width - radius
        p.vx = -Math.abs(p.vx)
      }
      if (p.y < radius) {
        p.y = radius
        p.vy = Math.abs(p.vy)
      } else if (p.y > height - radius) {
        p.y = height - radius
        p.vy = -Math.abs(p.vy)
      }
    } else if (drift === 'warp') {
      // Al salir por abajo o por los costados, renace en el borde superior con
      // una x distribuida en todo el ancho (no en un único punto de origen).
      if (p.x < 0 || p.x > width || p.y > height) {
        p.x = hash01(p.x * 12.9898 + p.y * 78.233) * width
        p.y = 0
      }
    } else {
      // Modos direccionales: reingreso por el borde opuesto (wrap).
      if (p.x < 0) p.x = width
      else if (p.x > width) p.x = 0
      if (p.y < 0) p.y = height
      else if (p.y > height) p.y = 0
    }
  }
}

/**
 * Reescala las posiciones (y el spawn) de las partículas cuando el canvas
 * cambia de tamaño, manteniéndolas proporcionalmente en su lugar relativo.
 */
export function rescaleParticles(
  particles: Particle[],
  fromWidth: number,
  fromHeight: number,
  toWidth: number,
  toHeight: number,
): void {
  if (fromWidth <= 0 || fromHeight <= 0) return
  const sx = toWidth / fromWidth
  const sy = toHeight / fromHeight
  for (const p of particles) {
    p.x *= sx
    p.y *= sy
  }
}
