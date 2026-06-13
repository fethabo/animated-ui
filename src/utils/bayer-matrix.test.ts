import { describe, expect, it } from 'vitest'
import { BAYER_8, bayerThreshold } from './bayer-matrix'

describe('BAYER_8', () => {
  it('es una matriz 8×8', () => {
    expect(BAYER_8).toHaveLength(8)
    for (const row of BAYER_8) expect(row).toHaveLength(8)
  })

  it('contiene exactamente los valores 0..63 sin repetir (patrón Bayer estándar)', () => {
    const flat = BAYER_8.flat().sort((a, b) => a - b)
    expect(flat).toEqual(Array.from({ length: 64 }, (_, i) => i))
  })
})

describe('bayerThreshold', () => {
  it('(0,0) retorna el valor normalizado del menor threshold', () => {
    expect(bayerThreshold(0, 0)).toBeCloseTo(0.5 / 64)
  })

  it('cubre el rango [0,1): mínimo cerca de 0, máximo por debajo de 1', () => {
    let min = Infinity
    let max = -Infinity
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const t = bayerThreshold(row, col)
        expect(t).toBeGreaterThanOrEqual(0)
        expect(t).toBeLessThan(1)
        min = Math.min(min, t)
        max = Math.max(max, t)
      }
    }
    expect(min).toBeCloseTo(0.5 / 64)
    expect(max).toBeCloseTo(63.5 / 64)
  })

  it('repite el patrón cada 8 celdas (indexado por módulo)', () => {
    expect(bayerThreshold(8, 8)).toBe(bayerThreshold(0, 0))
    expect(bayerThreshold(9, 3)).toBe(bayerThreshold(1, 3))
  })

  it('maneja índices negativos con módulo positivo', () => {
    expect(bayerThreshold(-8, -8)).toBe(bayerThreshold(0, 0))
    expect(bayerThreshold(-1, -1)).toBe(bayerThreshold(7, 7))
  })
})
