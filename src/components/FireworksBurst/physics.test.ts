import { describe, expect, it } from 'vitest'
import { createPrng } from '../../utils/prng'
import { spawnRockets, stepFireworks, type Firework, type Rocket } from './physics'

const AREA = { width: 400, height: 300 }

const spawn = (seed: string, overrides?: Partial<Parameters<typeof spawnRockets>[0]>) =>
  spawnRockets({
    rockets: 3,
    particleCount: 20,
    ...AREA,
    origin: { x: 0.5, y: 1 },
    power: 12,
    colors: ['#f00', '#0f0', '#00f'],
    rng: createPrng(seed),
    ...overrides,
  })

describe('spawnRockets', () => {
  it('es determinista por seed', () => {
    expect(spawn('a')).toEqual(spawn('a'))
    expect(spawn('a')).not.toEqual(spawn('b'))
  })

  it('lanza desde el origin con impulso ascendente y despegue escalonado', () => {
    const pool = spawn('x') as Rocket[]
    expect(pool).toHaveLength(3)
    for (const r of pool) {
      expect(r.kind).toBe('rocket')
      expect(r.x).toBe(0.5 * AREA.width)
      expect(r.y).toBe(AREA.height)
      expect(r.vy).toBeLessThan(0) // asciende (y del canvas crece hacia abajo)
      expect(r.sparkCount).toBe(20)
    }
    // Stagger: el primero despega ya; los siguientes con delay creciente.
    expect(pool[0].delay).toBe(0)
    expect(pool[1].delay).toBeGreaterThan(0)
    expect(pool[2].delay).toBeGreaterThan(pool[1].delay)
  })
})

describe('stepFireworks', () => {
  it('un cohete con delay no se mueve hasta despegar', () => {
    const pool = spawn('x')
    const delayed = pool[1] as Rocket
    const { x, y, delay } = delayed
    stepFireworks(pool, { ...AREA, gravity: 0.2, rng: createPrng('step') })
    expect(delayed.x).toBe(x)
    expect(delayed.y).toBe(y)
    expect(delayed.delay).toBe(delay - 1)
  })

  it('el apex dispara la explosión: el cohete se reemplaza por sus chispas', () => {
    const rocket: Rocket = {
      kind: 'rocket',
      x: 200,
      y: 100,
      vx: 0,
      vy: -0.6, // un paso de gravedad 0.2 lo deja en -0.4 ≥ APEX_VY (-0.5)
      delay: 0,
      wobblePhase: 0,
      wobbleSpeed: 0.2,
      wobbleAmp: 0,
      color: '#f00',
      sparkCount: 15,
      burstPower: 5,
    }
    const pool: Firework[] = [rocket]
    stepFireworks(pool, { ...AREA, gravity: 0.2, rng: createPrng('boom') })
    expect(pool).toHaveLength(15)
    expect(pool.every((p) => p.kind === 'spark')).toBe(true)
    // Las chispas nacen donde explotó el cohete.
    for (const s of pool) {
      expect(s.x).toBeCloseTo(rocket.x)
      expect(s.y).toBeCloseTo(rocket.y)
    }
  })

  it('culléa las chispas muertas por vida agotada o salida del área', () => {
    const dying = {
      kind: 'spark' as const,
      x: 200,
      y: 100,
      vx: 0,
      vy: 0,
      color: '#fff',
      size: 2,
      life: 0.01,
      decay: 0.02,
    }
    const falling = { ...dying, life: 1, decay: 0.001, y: AREA.height + 10, vy: 1 }
    const alive = { ...dying, life: 1, decay: 0.001 }
    const pool: Firework[] = [dying, falling, alive]
    stepFireworks(pool, { ...AREA, gravity: 0.2, rng: createPrng('cull') })
    expect(pool).toHaveLength(1)
    expect(pool[0]).toBe(alive)
  })

  it('una ráfaga completa termina con el pool vacío (auto-stop del RAF)', () => {
    const pool = spawn('full')
    const rng = createPrng('full-step')
    for (let frame = 0; frame < 3000 && pool.length > 0; frame++) {
      stepFireworks(pool, { ...AREA, gravity: 0.2, rng })
    }
    expect(pool).toHaveLength(0)
  })
})
