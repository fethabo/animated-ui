import { describe, expect, it } from 'vitest'
import { createPrng } from '../../utils/prng'
import { spawnSparkles, sparkleScale, starGeometry, stepSparkles } from './physics'

const AREA = { width: 400, height: 300 }

const spawn = (seed: string, overrides?: Partial<Parameters<typeof spawnSparkles>[0]>) =>
  spawnSparkles({
    count: 10,
    ...AREA,
    origin: { x: 0.5, y: 0.5 },
    spread: 60,
    size: 12,
    lifespan: 54,
    colors: ['#fde047', '#ffffff'],
    rng: createPrng(seed),
    ...overrides,
  })

describe('spawnSparkles', () => {
  it('es determinista por seed', () => {
    expect(spawn('a')).toEqual(spawn('a'))
    expect(spawn('a')).not.toEqual(spawn('b'))
  })

  it('dispersa los destellos dentro del radio spread alrededor del origen', () => {
    const pool = spawn('disc')
    const cx = 0.5 * AREA.width
    const cy = 0.5 * AREA.height
    for (const s of pool) {
      const dist = Math.hypot(s.x - cx, s.y - cy)
      expect(dist).toBeLessThanOrEqual(60)
    }
  })
})

describe('sparkleScale', () => {
  it('crece rápido, llega al máximo y se encoge hasta morir', () => {
    expect(sparkleScale(0)).toBe(0)
    expect(sparkleScale(0.25)).toBe(1) // fin de la fase de crecimiento
    expect(sparkleScale(0.125)).toBeCloseTo(0.5)
    expect(sparkleScale(0.625)).toBeCloseTo(0.5)
    expect(sparkleScale(1)).toBe(0)
  })
})

describe('stepSparkles', () => {
  it('el delay difiere la aparición sin envejecer al destello', () => {
    const pool = spawn('delay').filter((s) => s.delay > 0)
    expect(pool.length).toBeGreaterThan(0)
    const s = pool[0]
    const delay = s.delay
    stepSparkles(pool)
    expect(s.delay).toBe(delay - 1)
    expect(s.age).toBe(0)
  })

  it('culléa por vida agotada y una ráfaga completa termina vacía', () => {
    const pool = spawn('cull')
    for (let frame = 0; frame < 500 && pool.length > 0; frame++) stepSparkles(pool)
    expect(pool).toHaveLength(0)
  })
})

describe('starGeometry', () => {
  it('produce 4 puntas sobre los ejes y 4 cinturas en las diagonales', () => {
    const { tips, waists } = starGeometry(10)
    expect(tips).toHaveLength(4)
    expect(waists).toHaveLength(4)
    // Primera punta: arriba (y negativa en coordenadas de canvas).
    expect(tips[0].x).toBeCloseTo(0)
    expect(tips[0].y).toBeCloseTo(-10)
    // Todas las puntas a distancia exacta del radio; cinturas más adentro.
    for (const t of tips) expect(Math.hypot(t.x, t.y)).toBeCloseTo(10)
    for (const w of waists) expect(Math.hypot(w.x, w.y)).toBeLessThan(10)
  })
})
