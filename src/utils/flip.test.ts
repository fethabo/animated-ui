import { describe, expect, it } from 'vitest'
import { diffKeys, invert, isIdentity, type FlipRect } from './flip'

const rect = (left: number, top: number, width = 100, height = 40): FlipRect => ({
  left,
  top,
  width,
  height,
})

describe('invert: delta de inversión entre rects', () => {
  it('un movimiento de (0,0) a (100,50) produce la inversión (-100,-50)', () => {
    const inversion = invert(rect(0, 0), rect(100, 50))
    expect(inversion.dx).toBe(-100)
    expect(inversion.dy).toBe(-50)
    expect(inversion.sx).toBe(1)
    expect(inversion.sy).toBe(1)
  })

  it('sin movimiento la inversión es identidad', () => {
    const inversion = invert(rect(20, 30), rect(20, 30))
    expect(inversion).toEqual({ dx: 0, dy: 0, sx: 1, sy: 1 })
  })

  it('sin `withScale` ignora los cambios de tamaño', () => {
    const inversion = invert(rect(0, 0, 100, 40), rect(0, 0, 200, 80))
    expect(inversion.sx).toBe(1)
    expect(inversion.sy).toBe(1)
  })

  it('con `withScale` calcula la escala y el delta entre centros', () => {
    // First: centro (50, 20), 100x40. Last: centro (150, 60), 200x80.
    const inversion = invert(rect(0, 0, 100, 40), rect(50, 20, 200, 80), true)
    expect(inversion.sx).toBe(0.5)
    expect(inversion.sy).toBe(0.5)
    expect(inversion.dx).toBe(-100)
    expect(inversion.dy).toBe(-40)
  })

  it('con `withScale` y rect Last degenerado (0x0) no divide por cero', () => {
    const inversion = invert(rect(0, 0, 100, 40), rect(10, 10, 0, 0), true)
    expect(inversion.sx).toBe(1)
    expect(inversion.sy).toBe(1)
    expect(inversion.dx).toBe(-10)
  })
})

describe('isIdentity: umbral de animación', () => {
  it('deltas sub-píxel cuentan como identidad', () => {
    expect(isIdentity({ dx: 0.2, dy: -0.3, sx: 1, sy: 1 })).toBe(true)
  })

  it('una traslación real no es identidad', () => {
    expect(isIdentity({ dx: 12, dy: 0, sx: 1, sy: 1 })).toBe(false)
  })

  it('un cambio de escala real no es identidad', () => {
    expect(isIdentity({ dx: 0, dy: 0, sx: 0.8, sy: 1 })).toBe(false)
  })
})

describe('diffKeys: clasificación entre renders', () => {
  it('clasifica [a,b,c] → [b,c,d]: d entra, a sale, b y c persisten', () => {
    const diff = diffKeys(['a', 'b', 'c'], ['b', 'c', 'd'])
    expect(diff.entered).toEqual(['d'])
    expect(diff.exited).toEqual(['a'])
    expect(diff.persisted).toEqual(['b', 'c'])
  })

  it('un reorden puro no produce entradas ni salidas', () => {
    const diff = diffKeys(['a', 'b', 'c'], ['c', 'a', 'b'])
    expect(diff.entered).toEqual([])
    expect(diff.exited).toEqual([])
    expect(diff.persisted).toEqual(['c', 'a', 'b'])
  })

  it('listas vacías: todo entra o todo sale', () => {
    expect(diffKeys([], ['a', 'b']).entered).toEqual(['a', 'b'])
    expect(diffKeys(['a', 'b'], []).exited).toEqual(['a', 'b'])
  })

  it('preserva el orden de aparición de cada render', () => {
    const diff = diffKeys(['x', 'a', 'y'], ['b', 'a', 'c'])
    expect(diff.entered).toEqual(['b', 'c'])
    expect(diff.exited).toEqual(['x', 'y'])
    expect(diff.persisted).toEqual(['a'])
  })
})
