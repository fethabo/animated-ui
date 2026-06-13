import { describe, expect, it } from 'vitest'
import { createParticles, cursorForce, rescaleParticles, stepParticles, type Particle } from './physics'

// Generador determinista para tests reproducibles.
function seqRandom(values: number[]): () => number {
  let i = 0
  return () => values[i++ % values.length]
}

describe('createParticles', () => {
  it('crea exactamente `count` partículas', () => {
    const ps = createParticles({ count: 30, width: 100, height: 100, speed: 1 })
    expect(ps).toHaveLength(30)
  })

  it('posiciones dentro del bounds y velocidades dentro de [-speed, speed]', () => {
    const ps = createParticles({ count: 200, width: 320, height: 240, speed: 2 })
    for (const p of ps) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(320)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(240)
      expect(Math.abs(p.vx)).toBeLessThanOrEqual(2)
      expect(Math.abs(p.vy)).toBeLessThanOrEqual(2)
    }
  })

  it('usa la fuente de aleatoriedad inyectada', () => {
    const ps = createParticles({ count: 1, width: 100, height: 50, speed: 1, random: seqRandom([0.5]) })
    expect(ps[0]).toEqual({ x: 50, y: 25, vx: 0, vy: 0 })
  })
})

describe('stepParticles', () => {
  const baseOpts = {
    width: 100,
    height: 100,
    cursor: null,
    cursorRadius: 50,
    cursorInteraction: 'repel' as const,
    radius: 2,
    maxSpeed: 10,
  }

  it('integra la posición sumando la velocidad', () => {
    const ps: Particle[] = [{ x: 50, y: 50, vx: 3, vy: -2 }]
    stepParticles(ps, baseOpts)
    expect(ps[0].x).toBe(53)
    expect(ps[0].y).toBe(48)
  })

  it('rebota en el borde derecho invirtiendo vx', () => {
    const ps: Particle[] = [{ x: 99, y: 50, vx: 5, vy: 0 }]
    stepParticles(ps, baseOpts)
    expect(ps[0].x).toBe(98) // width - radius
    expect(ps[0].vx).toBeLessThan(0)
  })

  it('rebota en el borde superior invirtiendo vy', () => {
    const ps: Particle[] = [{ x: 50, y: 1, vx: 0, vy: -5 }]
    stepParticles(ps, baseOpts)
    expect(ps[0].y).toBe(2) // radius
    expect(ps[0].vy).toBeGreaterThan(0)
  })

  it('clampea la velocidad a maxSpeed', () => {
    const ps: Particle[] = [{ x: 50, y: 50, vx: 999, vy: -999 }]
    stepParticles(ps, { ...baseOpts, maxSpeed: 4 })
    expect(ps[0].vx).toBeLessThanOrEqual(4)
    expect(ps[0].vy).toBeGreaterThanOrEqual(-4)
  })
})

describe('cursorForce', () => {
  it('repele: empuja la partícula en dirección contraria al cursor', () => {
    // Partícula a la derecha del cursor → fuerza hacia la derecha (fx > 0).
    const { fx, fy } = cursorForce(60, 50, { x: 50, y: 50 }, 50, 'repel')
    expect(fx).toBeGreaterThan(0)
    expect(fy).toBeCloseTo(0)
  })

  it('atrae: empuja la partícula hacia el cursor', () => {
    const { fx } = cursorForce(60, 50, { x: 50, y: 50 }, 50, 'attract')
    expect(fx).toBeLessThan(0)
  })

  it('sin efecto fuera del radio', () => {
    expect(cursorForce(200, 50, { x: 50, y: 50 }, 50, 'repel')).toEqual({ fx: 0, fy: 0 })
  })

  it("sin efecto con mode 'none'", () => {
    expect(cursorForce(55, 50, { x: 50, y: 50 }, 50, 'none')).toEqual({ fx: 0, fy: 0 })
  })

  it('la fuerza crece al acercarse al cursor', () => {
    const near = cursorForce(55, 50, { x: 50, y: 50 }, 50, 'repel')
    const far = cursorForce(95, 50, { x: 50, y: 50 }, 50, 'repel')
    expect(Math.abs(near.fx)).toBeGreaterThan(Math.abs(far.fx))
  })
})

describe('rescaleParticles', () => {
  it('reescala posiciones proporcionalmente al nuevo tamaño', () => {
    const ps: Particle[] = [{ x: 50, y: 25, vx: 0, vy: 0 }]
    rescaleParticles(ps, 100, 50, 200, 100)
    expect(ps[0].x).toBe(100)
    expect(ps[0].y).toBe(50)
  })

  it('no hace nada si el tamaño previo es degenerado', () => {
    const ps: Particle[] = [{ x: 10, y: 10, vx: 0, vy: 0 }]
    rescaleParticles(ps, 0, 0, 200, 100)
    expect(ps[0]).toEqual({ x: 10, y: 10, vx: 0, vy: 0 })
  })
})
