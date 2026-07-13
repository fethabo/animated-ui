import { describe, expect, it } from 'vitest'
import { createPrng } from '../../utils/prng'
import { spawnEmojis, stepEmojis, type EmojiParticle } from './physics'

const AREA = { width: 400, height: 300 }

const spawn = (seed: string, overrides?: Partial<Parameters<typeof spawnEmojis>[0]>) =>
  spawnEmojis({
    count: 20,
    ...AREA,
    origin: { x: 0.5, y: 0.5 },
    angle: 90,
    spread: 60,
    power: 10,
    size: 24,
    emojis: ['🎉', '❤️', '👍'],
    rng: createPrng(seed),
    ...overrides,
  })

describe('spawnEmojis', () => {
  it('es determinista por seed', () => {
    expect(spawn('a')).toEqual(spawn('a'))
    expect(spawn('a')).not.toEqual(spawn('b'))
  })

  it('sortea cada emoji de la lista provista', () => {
    const pool = spawn('emojis')
    for (const p of pool) {
      expect(['🎉', '❤️', '👍']).toContain(p.emoji)
    }
  })

  it('con angle=90 el abanico sale hacia arriba desde el origin', () => {
    const pool = spawn('up', { spread: 30 })
    for (const p of pool) {
      expect(p.x).toBe(0.5 * AREA.width)
      expect(p.y).toBe(0.5 * AREA.height)
      expect(p.vy).toBeLessThan(0) // asciende (y del canvas crece hacia abajo)
    }
  })
})

describe('stepEmojis', () => {
  it('integra gravedad, avanza el giro y decae la vida', () => {
    const pool = spawn('step')
    const p = pool[0]
    const { vy, rotation, life } = p
    stepEmojis(pool, { ...AREA, gravity: 0.25 })
    expect(p.vy).toBeGreaterThan(vy) // la gravedad frena el ascenso
    expect(p.rotation).not.toBe(rotation)
    expect(p.life).toBeLessThan(life)
  })

  it('culléa por vida agotada o salida del área', () => {
    const base: EmojiParticle = {
      x: 200,
      y: 100,
      vx: 0,
      vy: 0,
      rotation: 0,
      rotationSpeed: 0,
      emoji: '🎉',
      size: 24,
      life: 1,
      decay: 0.001,
    }
    const dying = { ...base, life: 0.0005 }
    const fallen = { ...base, y: AREA.height + 30, vy: 1 }
    const pool = [dying, fallen, { ...base }]
    stepEmojis(pool, { ...AREA, gravity: 0.25 })
    expect(pool).toHaveLength(1)
  })

  it('una ráfaga completa termina con el pool vacío (auto-stop del RAF)', () => {
    const pool = spawn('full')
    for (let frame = 0; frame < 3000 && pool.length > 0; frame++) {
      stepEmojis(pool, { ...AREA, gravity: 0.25 })
    }
    expect(pool).toHaveLength(0)
  })
})
