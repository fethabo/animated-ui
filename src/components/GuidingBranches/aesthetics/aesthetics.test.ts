import { describe, expect, it } from 'vitest'
import { createPrng } from '../../../utils/prng'
import { aesthetics } from './index'
import type { BranchParams, Point } from './types'

const ORIGIN: Point = { x: 200, y: 200 }

const ambientParams = (over: Partial<BranchParams> = {}): BranchParams => ({
  maxDistance: 150,
  density: 4,
  depth: 3,
  jitter: 0,
  curl: 0.6,
  bias: null,
  ...over,
})

const names = Object.keys(aesthetics) as Array<keyof typeof aesthetics>

describe.each(names)('estética %s', (name) => {
  const module = aesthetics[name]

  it('genera ramas no vacías', () => {
    const branches = module.generate(createPrng('a'), ORIGIN, ambientParams())
    expect(branches.length).toBeGreaterThan(0)
    for (const b of branches) expect(b.points.length).toBeGreaterThanOrEqual(2)
  })

  it('es determinista por seed', () => {
    const a = module.generate(createPrng('seed'), ORIGIN, ambientParams())
    const b = module.generate(createPrng('seed'), ORIGIN, ambientParams())
    expect(a).toEqual(b)
  })

  it('ninguna rama supera maxDistance desde el origen', () => {
    const maxDistance = 150
    // jitter de lightning puede sobresalir un poco del esqueleto: tolerancia.
    const tolerance = name === 'lightning' ? maxDistance * 0.12 : 0.001
    const branches = module.generate(createPrng('bound'), ORIGIN, ambientParams({ maxDistance }))
    for (const branch of branches) {
      for (const p of branch.points) {
        const d = Math.hypot(p.x - ORIGIN.x, p.y - ORIGIN.y)
        expect(d).toBeLessThanOrEqual(maxDistance + tolerance)
      }
    }
  })

  it('en modo directed el tronco dominante se orienta hacia el target (bias)', () => {
    const bias = 0 // hacia la derecha (+x)
    const branches = module.generate(createPrng('dir'), ORIGIN, ambientParams({ bias }))
    // Troncos = ramas que nacen en el origen (las sub-ramas arrancan adentro).
    const isTrunk = (b: { points: Array<{ x: number; y: number }> }) =>
      Math.hypot(b.points[0].x - ORIGIN.x, b.points[0].y - ORIGIN.y) < 0.001
    const trunks = branches.filter(isTrunk)
    expect(trunks.length).toBeGreaterThan(0)
    // El tronco más largo es el dominante (en directed recibe el budget mayor).
    let dom = trunks[0]
    let domLen = 0
    for (const b of trunks) {
      const end = b.points[b.points.length - 1]
      const len = Math.hypot(end.x - ORIGIN.x, end.y - ORIGIN.y)
      if (len > domLen) {
        domLen = len
        dom = b
      }
    }
    // Su dirección inicial (robusta a la curvatura) apunta hacia el target.
    const a = dom.points[0]
    const c = dom.points[1]
    const initAngle = Math.atan2(c.y - a.y, c.x - a.x)
    expect(Math.cos(initAngle)).toBeGreaterThan(0.5)
    expect(Math.abs(initAngle - bias)).toBeLessThan(1)
  })

  it('mayor densidad ⇒ más ramas (en promedio)', () => {
    const low = module.generate(createPrng('x'), ORIGIN, ambientParams({ density: 2 }))
    const high = module.generate(createPrng('x'), ORIGIN, ambientParams({ density: 8 }))
    expect(high.length).toBeGreaterThanOrEqual(low.length)
  })
})
