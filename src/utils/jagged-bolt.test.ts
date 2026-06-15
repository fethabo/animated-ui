import { describe, expect, it } from 'vitest'
import { createPrng } from './prng'
import { jaggedBolt, type Point } from './jagged-bolt'

const FROM: Point = { x: 0, y: 0 }
const TO: Point = { x: 100, y: 0 }

/** Distancia perpendicular de un punto a la recta from→to (eje X en este caso). */
function perpDistance(p: Point): number {
  return Math.abs(p.y)
}

describe('jaggedBolt', () => {
  it('mantiene fijos los extremos', () => {
    const bolt = jaggedBolt(createPrng('a'), FROM, TO, { jitter: 20 })
    expect(bolt[0]).toEqual(FROM)
    expect(bolt[bolt.length - 1]).toEqual(TO)
  })

  it('produce 2^detail + 1 puntos', () => {
    expect(jaggedBolt(createPrng('a'), FROM, TO, { jitter: 10, detail: 3 })).toHaveLength(9)
    expect(jaggedBolt(createPrng('a'), FROM, TO, { jitter: 10, detail: 5 })).toHaveLength(33)
  })

  it('es determinista por seed', () => {
    const a = jaggedBolt(createPrng('seed'), FROM, TO, { jitter: 15 })
    const b = jaggedBolt(createPrng('seed'), FROM, TO, { jitter: 15 })
    expect(a).toEqual(b)
  })

  it('seeds distintas producen rayos distintos', () => {
    const a = jaggedBolt(createPrng('uno'), FROM, TO, { jitter: 15 })
    const b = jaggedBolt(createPrng('dos'), FROM, TO, { jitter: 15 })
    expect(a).not.toEqual(b)
  })

  it('no es una línea recta (hay desviaciones)', () => {
    const bolt = jaggedBolt(createPrng('jag'), FROM, TO, { jitter: 20 })
    const maxDev = Math.max(...bolt.map(perpDistance))
    expect(maxDev).toBeGreaterThan(0)
  })

  it('la desviación queda acotada por ~2×jitter', () => {
    const jitter = 12
    const bolt = jaggedBolt(createPrng('bound'), FROM, TO, { jitter })
    for (const p of bolt) {
      expect(perpDistance(p)).toBeLessThanOrEqual(jitter * 2 + 0.001)
    }
  })

  it('mayor jitter ⇒ mayor desviación', () => {
    const small = jaggedBolt(createPrng('s'), FROM, TO, { jitter: 5 })
    const big = jaggedBolt(createPrng('s'), FROM, TO, { jitter: 40 })
    const devSmall = Math.max(...small.map(perpDistance))
    const devBig = Math.max(...big.map(perpDistance))
    expect(devBig).toBeGreaterThan(devSmall)
  })
})
