import { describe, expect, it } from 'vitest'
// @ts-expect-error — import ?raw de Vite (el fuente como string, sin tipos)
import physicsSource from './physics.ts?raw'
import { createPrng } from '../../utils/prng'
import { spawnFlakes, stepFlakes, type SpawnOptions } from './physics'

const BASE: Omit<SpawnOptions, 'rng'> = {
  count: 50,
  width: 800,
  height: 600,
  origin: { x: 0.5, y: 0.5 },
  angle: 90,
  spread: 60,
  power: 12,
  colors: ['#f43f5e', '#fbbf24', '#34d399'],
  shapes: ['rect', 'circle'],
}

function spawn(overrides: Partial<SpawnOptions> = {}) {
  return spawnFlakes({ ...BASE, rng: createPrng('test-seed'), ...overrides })
}

describe('spawnFlakes', () => {
  it('spawnea todos los copos en el origen configurado', () => {
    const flakes = spawn({ origin: { x: 0.25, y: 1 } })
    for (const f of flakes) {
      expect(f.x).toBe(0.25 * 800)
      expect(f.y).toBe(600)
    }
  })

  it('el abanico queda dentro del cono angle ± spread/2', () => {
    const flakes = spawn({ angle: 90, spread: 45, count: 200 })
    for (const f of flakes) {
      // Ángulo real de la velocidad, deshaciendo la inversión del eje y del canvas.
      const deg = (Math.atan2(-f.vy, f.vx) * 180) / Math.PI
      expect(deg).toBeGreaterThanOrEqual(90 - 22.5)
      expect(deg).toBeLessThanOrEqual(90 + 22.5)
    }
  })

  it('la velocidad inicial jittéa sin superar power', () => {
    const flakes = spawn({ count: 200 })
    for (const f of flakes) {
      const speed = Math.hypot(f.vx, f.vy)
      expect(speed).toBeGreaterThan(0)
      expect(speed).toBeLessThanOrEqual(12)
    }
  })

  it('sortea color y forma dentro de lo configurado', () => {
    const flakes = spawn({ count: 100 })
    for (const f of flakes) {
      expect(BASE.colors).toContain(f.color)
      expect(BASE.shapes).toContain(f.shape)
    }
  })

  it('es determinista: la misma seed produce la misma ráfaga', () => {
    const a = spawnFlakes({ ...BASE, rng: createPrng('seed-42') })
    const b = spawnFlakes({ ...BASE, rng: createPrng('seed-42') })
    expect(a).toEqual(b)
    const c = spawnFlakes({ ...BASE, rng: createPrng('seed-43') })
    expect(c).not.toEqual(a)
  })
})

describe('stepFlakes', () => {
  it('la gravedad hace caer los copos (vy crece frame a frame)', () => {
    const flakes = spawn({ count: 20 })
    const before = flakes.map((f) => f.vy)
    stepFlakes(flakes, { width: 800, height: 600, gravity: 0.3, drag: 1 })
    flakes.forEach((f, i) => {
      expect(f.vy).toBeGreaterThan(before[i])
    })
  })

  it('un copo disparado hacia arriba termina cayendo por debajo de su origen', () => {
    const flakes = spawn({ count: 1, angle: 90, spread: 0, origin: { x: 0.5, y: 0.5 } })
    const f = flakes[0]
    f.decay = 0 // aísla la trayectoria del culling por vida
    const startY = f.y
    expect(f.vy).toBeLessThan(0) // sale hacia arriba
    // Área muy alta para observar la caída sin que el culling lo saque antes.
    for (let i = 0; i < 300 && flakes.length > 0 && f.y <= startY + 100; i++) {
      stepFlakes(flakes, { width: 800, height: 100000, gravity: 0.3 })
    }
    expect(f.y).toBeGreaterThan(startY)
  })

  it('culléa por salida del área hasta vaciar el pool', () => {
    const flakes = spawn({ count: 50 })
    let steps = 0
    while (flakes.length > 0 && steps < 2000) {
      stepFlakes(flakes, { width: 800, height: 600, gravity: 0.3 })
      steps++
    }
    expect(flakes).toHaveLength(0)
  })

  it('culléa por vida agotada aunque el copo siga dentro del área (sin gravedad)', () => {
    const flakes = spawn({ count: 30, power: 0 })
    let steps = 0
    while (flakes.length > 0 && steps < 2000) {
      stepFlakes(flakes, { width: 800, height: 600, gravity: 0 })
      steps++
    }
    expect(flakes).toHaveLength(0)
  })
})

describe('restricciones del paquete', () => {
  it('physics.ts no usa Math.random ni Date.now', () => {
    expect(physicsSource).not.toMatch(/Math\.random/)
    expect(physicsSource).not.toMatch(/Date\.now/)
  })
})
