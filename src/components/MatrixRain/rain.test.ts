import { describe, expect, it } from 'vitest'
import { createPrng } from '../../utils/prng'
import {
  computeGrid,
  createColumns,
  MAX_COLUMNS,
  pickGlyph,
  stepColumns,
} from './rain'

describe('createColumns: determinismo', () => {
  it('misma seed y misma grilla producen las mismas columnas', () => {
    const options = { columns: 20, rows: 30, seed: 'aui' }
    expect(createColumns(options)).toEqual(createColumns(options))
  })

  it('seeds distintas producen columnas distintas', () => {
    const a = createColumns({ columns: 20, rows: 30, seed: 'aui' })
    const b = createColumns({ columns: 20, rows: 30, seed: 'otra' })
    expect(a).not.toEqual(b)
  })

  it('la secuencia de avance es determinista de punta a punta', () => {
    const run = () => {
      const columns = createColumns({ columns: 10, rows: 20, seed: 'aui' })
      const rng = createPrng('aui:step')
      const trace: number[][] = []
      for (let i = 0; i < 50; i++) {
        trace.push(stepColumns(columns, 0.05, { rows: 20, rowsPerSecond: 12, rng }))
      }
      return { columns, trace }
    }
    expect(run()).toEqual(run())
  })
})

describe('stepColumns: avance y reinicio', () => {
  it('reporta cuántas filas enteras cruzó cada cabeza (glifos a dibujar)', () => {
    const columns = [{ head: 0.9, speed: 1, delay: 0 }]
    const crossed = stepColumns(columns, 1, { rows: 100, rowsPerSecond: 2.5, rng: createPrng('x') })
    expect(crossed).toEqual([3]) // 0.9 → 3.4 cruza las filas 1, 2 y 3
  })

  it('una columna en delay lo consume sin avanzar', () => {
    const columns = [{ head: 5, speed: 1, delay: 0.5 }]
    const crossed = stepColumns(columns, 0.2, { rows: 100, rowsPerSecond: 10, rng: createPrng('x') })
    expect(crossed).toEqual([0])
    expect(columns[0].head).toBe(5)
    expect(columns[0].delay).toBeCloseTo(0.3)
  })

  it('al salir por abajo la columna reinicia desde arriba con delay pseudoaleatorio', () => {
    const columns = [{ head: 19.5, speed: 1, delay: 0 }]
    stepColumns(columns, 0.1, { rows: 20, rowsPerSecond: 10, rng: createPrng('x') })
    expect(columns[0].head).toBe(0)
    expect(columns[0].delay).toBeGreaterThan(0)
  })
})

describe('pickGlyph y computeGrid', () => {
  it('pickGlyph elige glifos del charset de forma determinista', () => {
    const glyphs = () => {
      const rng = createPrng('glifos')
      return Array.from({ length: 10 }, () => pickGlyph(rng, '01'))
    }
    expect(glyphs()).toEqual(glyphs())
    for (const g of glyphs()) expect(['0', '1']).toContain(g)
  })

  it('pickGlyph con charset vacío retorna cadena vacía', () => {
    expect(pickGlyph(createPrng('x'), '')).toBe('')
  })

  it('computeGrid deriva la grilla de fontSize y capa las columnas', () => {
    expect(computeGrid(320, 200, 16)).toEqual({ columns: 20, rows: 13 })
    // subir fontSize baja la densidad de columnas
    expect(computeGrid(320, 200, 32).columns).toBe(10)
    expect(computeGrid(100_000, 200, 10).columns).toBe(MAX_COLUMNS)
  })
})
