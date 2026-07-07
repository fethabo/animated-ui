/*
 * Simulación pura de FlowField — sin DOM ni canvas. Las partículas avanzan
 * siguiendo el ángulo que dicta el campo de ruido en su posición (una muestra
 * por partícula por paso, el presupuesto del design); el componente dibuja el
 * segmento `(px, py) → (x, y)` de cada paso y la persistencia del trazo la
 * resuelve el canvas (velo semitransparente), no esta simulación. Toda la
 * aleatoriedad (posiciones iniciales y respawns) entra por el `Prng`
 * inyectado — determinista por seed.
 */
import type { Prng } from '../../utils/prng'
import { pick } from '../../utils/prng'
import type { Noise2D } from '../../utils/noise'

export interface FlowParticle {
  x: number
  y: number
  /** Posición del paso anterior: el segmento a dibujar es `(px,py) → (x,y)`. */
  px: number
  py: number
  color: string
}

export interface CreateFlowParticlesOptions {
  count: number
  width: number
  height: number
  colors: readonly string[]
  rng: Prng
}

/**
 * Crea `count` partículas en posiciones sorteadas con el `rng`, cada una con
 * un color de la paleta. `px/py` arrancan en la posición inicial (primer
 * segmento de longitud cero: sin líneas espurias).
 */
export function createFlowParticles({
  count,
  width,
  height,
  colors,
  rng,
}: CreateFlowParticlesOptions): FlowParticle[] {
  const particles: FlowParticle[] = []
  for (let i = 0; i < count; i++) {
    const x = rng() * width
    const y = rng() * height
    particles.push({ x, y, px: x, py: y, color: pick(rng, colors) ?? '#ffffff' })
  }
  return particles
}

export interface StepFlowParticlesOptions {
  width: number
  height: number
  /** Avance por paso en px. */
  speed: number
  /** Zoom del campo: px de canvas por unidad de ruido (mayor ⇒ curvas más amplias). */
  scale: number
  /** Campo de ruido seedeado; el ángulo de avance es `noise(x/scale, y/scale) * π`. */
  noise: Noise2D
  /** Fuente de los respawns deterministas. */
  rng: Prng
}

/**
 * Avanza las partículas un paso, mutándolas en su lugar: el ángulo sale del
 * valor del ruido en la posición (mapeado a `[-π, π]`), el avance es `speed`
 * px. Una partícula que sale del área **respawnea** en una posición sorteada
 * con el `rng` (determinista) y resetea `px/py` a la nueva posición para que
 * el componente no dibuje un segmento cruzando el canvas.
 */
export function stepFlowParticles(particles: FlowParticle[], opts: StepFlowParticlesOptions): void {
  const { width, height, speed, scale, noise, rng } = opts
  for (const p of particles) {
    p.px = p.x
    p.py = p.y
    const angle = noise(p.x / scale, p.y / scale) * Math.PI
    p.x += Math.cos(angle) * speed
    p.y += Math.sin(angle) * speed
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = rng() * width
      p.y = rng() * height
      p.px = p.x
      p.py = p.y
    }
  }
}
