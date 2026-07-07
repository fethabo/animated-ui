import { describe, expect, it } from 'vitest'
import { magnifyScale } from './magnify'

describe('magnifyScale', () => {
  it('alcanza la escala máxima en el cursor (distancia 0)', () => {
    expect(magnifyScale(0, 120, 1.5)).toBe(1.5)
    expect(magnifyScale(0, 120, 2)).toBe(2)
  })

  it('vale exactamente 1 en el borde del radio y fuera de él', () => {
    expect(magnifyScale(120, 120, 2)).toBeCloseTo(1, 10)
    expect(magnifyScale(121, 120, 2)).toBe(1)
    expect(magnifyScale(500, 120, 2)).toBe(1)
  })

  it('es simétrico respecto del cursor', () => {
    for (const d of [10, 45, 80, 119]) {
      expect(magnifyScale(d, 120, 1.8)).toBe(magnifyScale(-d, 120, 1.8))
    }
  })

  it('decrece monótonamente del centro al borde', () => {
    let previous = magnifyScale(0, 120, 2)
    for (let d = 10; d <= 120; d += 10) {
      const current = magnifyScale(d, 120, 2)
      expect(current).toBeLessThan(previous)
      previous = current
    }
  })

  it('parámetros degenerados no magnifican', () => {
    expect(magnifyScale(10, 0, 2)).toBe(1)
    expect(magnifyScale(10, -5, 2)).toBe(1)
    expect(magnifyScale(10, 120, 1)).toBe(1)
    expect(magnifyScale(10, 120, 0.5)).toBe(1)
  })
})
