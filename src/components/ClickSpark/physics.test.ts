import { describe, expect, it } from 'vitest'
import { createPrng } from '../../utils/prng'
import { spawnSparks, stepSparks } from './physics'

const spawn = (seed: string, overrides?: Partial<Parameters<typeof spawnSparks>[0]>) =>
  spawnSparks({
    count: 8,
    origin: { x: 100, y: 50 },
    radius: 40,
    size: 8,
    lifespan: 24,
    colors: ['#fbbf24', '#f59e0b'],
    rng: createPrng(seed),
    ...overrides,
  })

describe('spawnSparks', () => {
  it('es determinista por seed', () => {
    expect(spawn('a')).toEqual(spawn('a'))
    expect(spawn('a')).not.toEqual(spawn('b'))
  })

  it('emite desde el punto de click en todas las direcciones', () => {
    const sparks = spawn('radial')
    expect(sparks).toHaveLength(8)
    for (const s of sparks) {
      expect(s.x).toBe(100)
      expect(s.y).toBe(50)
    }
    // Distribución pareja: hay chispas hacia ambos lados de cada eje.
    expect(sparks.some((s) => s.vx > 0)).toBe(true)
    expect(sparks.some((s) => s.vx < 0)).toBe(true)
    expect(sparks.some((s) => s.vy > 0)).toBe(true)
    expect(sparks.some((s) => s.vy < 0)).toBe(true)
  })

  it('el alcance queda en el orden del radius pedido', () => {
    const sparks = spawn('reach', { count: 1, radius: 40 })
    const s = sparks[0]
    const start = { x: s.x, y: s.y }
    // Se integra sin decaimiento de vida para medir el recorrido puro.
    s.decay = 0
    for (let i = 0; i < 200; i++) stepSparks([s])
    const dist = Math.hypot(s.x - start.x, s.y - start.y)
    expect(dist).toBeGreaterThan(10)
    expect(dist).toBeLessThanOrEqual(45)
  })
})

describe('stepSparks', () => {
  it('frena con drag, decae la vida y culléa las chispas muertas', () => {
    const sparks = spawn('cull')
    const s = sparks[0]
    const speed0 = Math.hypot(s.vx, s.vy)
    stepSparks(sparks)
    expect(Math.hypot(s.vx, s.vy)).toBeLessThan(speed0)
    expect(s.life).toBeLessThan(1)

    for (let frame = 0; frame < 200 && sparks.length > 0; frame++) stepSparks(sparks)
    expect(sparks).toHaveLength(0)
  })
})
