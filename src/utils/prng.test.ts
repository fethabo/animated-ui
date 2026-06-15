import { describe, expect, it } from 'vitest'
import { createPrng, int, pick, range } from './prng'

describe('createPrng (determinismo)', () => {
  it('la misma seed produce la misma secuencia', () => {
    const a = createPrng('hola')
    const b = createPrng('hola')
    const seqA = Array.from({ length: 8 }, () => a())
    const seqB = Array.from({ length: 8 }, () => b())
    expect(seqA).toEqual(seqB)
  })

  it('acepta seeds numéricas y de string de forma consistente', () => {
    const a = createPrng(42)
    const b = createPrng('42')
    expect(Array.from({ length: 5 }, () => a())).toEqual(Array.from({ length: 5 }, () => b()))
  })

  it('seeds distintas producen secuencias distintas', () => {
    const a = createPrng('uno')
    const b = createPrng('dos')
    const seqA = Array.from({ length: 8 }, () => a())
    const seqB = Array.from({ length: 8 }, () => b())
    expect(seqA).not.toEqual(seqB)
  })

  it('produce flotantes en [0, 1)', () => {
    const rng = createPrng('rango')
    for (let i = 0; i < 1000; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('distribución razonable: media cercana a 0.5 en muchas muestras', () => {
    const rng = createPrng('dist')
    let sum = 0
    const n = 5000
    for (let i = 0; i < n; i++) sum += rng()
    const mean = sum / n
    expect(mean).toBeGreaterThan(0.45)
    expect(mean).toBeLessThan(0.55)
  })

  it('no produce secuencias triviales (valores variados)', () => {
    const rng = createPrng('variado')
    const values = new Set(Array.from({ length: 50 }, () => rng()))
    expect(values.size).toBeGreaterThan(40)
  })
})

describe('helpers range/int/pick', () => {
  it('range respeta [min, max)', () => {
    const rng = createPrng('r')
    for (let i = 0; i < 500; i++) {
      const v = range(rng, 10, 20)
      expect(v).toBeGreaterThanOrEqual(10)
      expect(v).toBeLessThan(20)
    }
  })

  it('int respeta [min, max] inclusive y devuelve enteros', () => {
    const rng = createPrng('i')
    const seen = new Set<number>()
    for (let i = 0; i < 1000; i++) {
      const v = int(rng, 1, 6)
      expect(Number.isInteger(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(6)
      seen.add(v)
    }
    // Con 1000 tiradas de un dado deberían salir las 6 caras.
    expect(seen.size).toBe(6)
  })

  it('pick devuelve un elemento del array', () => {
    const rng = createPrng('p')
    const items = ['a', 'b', 'c'] as const
    for (let i = 0; i < 100; i++) {
      expect(items).toContain(pick(rng, items))
    }
  })

  it('pick sobre array vacío devuelve undefined', () => {
    const rng = createPrng('vacio')
    expect(pick(rng, [])).toBeUndefined()
  })

  it('helpers son deterministas por seed', () => {
    const a = createPrng('det')
    const b = createPrng('det')
    expect(int(a, 0, 100)).toBe(int(b, 0, 100))
    expect(range(a, 0, 100)).toBe(range(b, 0, 100))
  })
})
