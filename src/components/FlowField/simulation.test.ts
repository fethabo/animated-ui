import { describe, expect, it } from 'vitest'
import { createNoise2D } from '../../utils/noise'
import { createPrng } from '../../utils/prng'
import { createFlowParticles, stepFlowParticles } from './simulation'

const COLORS = ['#22d3ee', '#a78bfa', '#f472b6']

function setup(seed = 'flow') {
  const rng = createPrng(seed)
  const noise = createNoise2D(seed)
  const particles = createFlowParticles({ count: 100, width: 400, height: 300, colors: COLORS, rng })
  return { rng, noise, particles }
}

describe('createFlowParticles', () => {
  it('crea las partículas dentro del área, con color de la paleta', () => {
    const { particles } = setup()
    expect(particles).toHaveLength(100)
    for (const p of particles) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(400)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(300)
      expect(p.px).toBe(p.x)
      expect(p.py).toBe(p.y)
      expect(COLORS).toContain(p.color)
    }
  })

  it('es determinista por seed', () => {
    const a = setup('same').particles
    const b = setup('same').particles
    expect(a).toEqual(b)
    const c = setup('other').particles
    expect(c).not.toEqual(a)
  })
})

describe('stepFlowParticles', () => {
  it('la evolución es determinista: misma seed ⇒ mismas trayectorias frame a frame', () => {
    const a = setup('evolution')
    const b = setup('evolution')
    for (let step = 0; step < 50; step++) {
      stepFlowParticles(a.particles, { width: 400, height: 300, speed: 2, scale: 120, noise: a.noise, rng: a.rng })
      stepFlowParticles(b.particles, { width: 400, height: 300, speed: 2, scale: 120, noise: b.noise, rng: b.rng })
      expect(a.particles).toEqual(b.particles)
    }
  })

  it('avanza cada partícula a lo sumo speed px por paso', () => {
    const { particles, noise, rng } = setup()
    const before = particles.map((p) => ({ x: p.x, y: p.y }))
    stepFlowParticles(particles, { width: 4000, height: 3000, speed: 1.5, scale: 120, noise, rng })
    particles.forEach((p, i) => {
      const d = Math.hypot(p.x - before[i].x, p.y - before[i].y)
      expect(d).toBeLessThanOrEqual(1.5 + 1e-9)
    })
  })

  it('registra el segmento del paso en px/py', () => {
    const { particles, noise, rng } = setup()
    const before = particles.map((p) => ({ x: p.x, y: p.y }))
    stepFlowParticles(particles, { width: 4000, height: 3000, speed: 1, scale: 120, noise, rng })
    particles.forEach((p, i) => {
      expect(p.px).toBe(before[i].x)
      expect(p.py).toBe(before[i].y)
    })
  })

  it('las partículas quedan dentro del área tras muchos pasos (respawn determinista)', () => {
    const { particles, noise, rng } = setup()
    for (let step = 0; step < 500; step++) {
      stepFlowParticles(particles, { width: 400, height: 300, speed: 3, scale: 80, noise, rng })
    }
    for (const p of particles) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(400)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(300)
    }
  })

  it('al respawnear resetea px/py (sin segmento cruzando el canvas)', () => {
    const { noise, rng } = setup()
    // Partícula forzada fuera del área en el próximo paso.
    const particles = [{ x: 399.9, y: 150, px: 399.9, py: 150, color: '#fff' }]
    for (let step = 0; step < 50; step++) {
      stepFlowParticles(particles, { width: 400, height: 300, speed: 5, scale: 80, noise, rng })
      const p = particles[0]
      const segment = Math.hypot(p.x - p.px, p.y - p.py)
      expect(segment).toBeLessThanOrEqual(5 + 1e-9)
    }
  })
})
