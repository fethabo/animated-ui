/*
 * Física pura de ParticleField — sin DOM ni canvas, testeable de forma
 * aislada. El componente instancia el array, lo avanza un paso por frame con
 * `stepParticles`, y dibuja el resultado; toda la matemática vive acá.
 */
import type { CursorInteraction } from './types'

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

export interface CreateParticlesOptions {
  count: number
  width: number
  height: number
  /** Rango de la velocidad inicial aleatoria en px/frame. */
  speed: number
  /** Fuente de aleatoriedad inyectable (tests deterministas). Default: `Math.random`. */
  random?: () => number
}

/**
 * Crea `count` partículas con posición aleatoria dentro de `[0, width] ×
 * [0, height]` y velocidad aleatoria en `[-speed, speed]` por eje.
 */
export function createParticles({
  count,
  width,
  height,
  speed,
  random = Math.random,
}: CreateParticlesOptions): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: random() * width,
      y: random() * height,
      vx: (random() * 2 - 1) * speed,
      vy: (random() * 2 - 1) * speed,
    })
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
}

/**
 * Avanza el array de partículas un frame, mutándolo en su lugar: aplica la
 * fuerza del cursor, clampea la velocidad, integra la posición y rebota en
 * los bordes invirtiendo la componente de velocidad correspondiente.
 */
export function stepParticles(particles: Particle[], opts: StepOptions): void {
  const { width, height, cursor, cursorRadius, cursorInteraction, radius, maxSpeed } = opts

  for (const p of particles) {
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
