import { describe, expect, it } from 'vitest'
import { createPrng } from '../../utils/prng'
import { createStarfield, spawnShootingStar, stepShootingStars } from './starfield'

const OPTIONS = {
  width: 400,
  height: 300,
  density: 1,
  colors: ['#fff', '#bfdbfe'],
  seed: 'aui',
}

describe('createStarfield: determinismo', () => {
  it('misma seed y mismo tamaño producen el mismo cielo', () => {
    expect(createStarfield(OPTIONS)).toEqual(createStarfield(OPTIONS))
  })

  it('seeds distintas producen cielos distintos', () => {
    const a = createStarfield(OPTIONS)
    const b = createStarfield({ ...OPTIONS, seed: 'otra' })
    expect(a).not.toEqual(b)
  })

  it('un cambio de tamaño regenera el campo de forma determinista', () => {
    const resized = { ...OPTIONS, width: 800, height: 600 }
    const a = createStarfield(resized)
    expect(a).not.toEqual(createStarfield(OPTIONS))
    expect(a).toEqual(createStarfield(resized))
  })

  it('la densidad escala la cantidad de estrellas y todas caen dentro del área', () => {
    const base = createStarfield(OPTIONS)
    const dense = createStarfield({ ...OPTIONS, density: 2 })
    expect(dense.length).toBe(base.length * 2)
    for (const star of dense) {
      expect(star.x).toBeGreaterThanOrEqual(0)
      expect(star.x).toBeLessThanOrEqual(OPTIONS.width)
      expect(star.y).toBeGreaterThanOrEqual(0)
      expect(star.y).toBeLessThanOrEqual(OPTIONS.height)
      expect(OPTIONS.colors).toContain(star.color)
    }
  })
})

describe('fugaces: spawn y trayectoria', () => {
  it('spawnShootingStar nace en el tercio superior con trayectoria descendente', () => {
    const rng = createPrng('fugaz')
    for (let i = 0; i < 20; i++) {
      const s = spawnShootingStar(rng, 400, 300)
      expect(s.y).toBeLessThanOrEqual(100)
      expect(s.vy).toBeGreaterThan(0)
      expect(s.life).toBeGreaterThan(0)
      expect(s.life).toBe(s.maxLife)
    }
  })

  it('stepShootingStars integra la trayectoria y descarta las agotadas', () => {
    const rng = createPrng('fugaz')
    const alive = spawnShootingStar(rng, 400, 300)
    const dying = { ...spawnShootingStar(rng, 400, 300), life: 0.05 }
    const stars = [alive, dying]
    const x0 = alive.x

    stepShootingStars(stars, 0.1)
    expect(stars).toHaveLength(1)
    expect(stars[0].x).not.toBe(x0)
  })
})
