import { describe, expect, it } from 'vitest'
import { pointAtDistance, pointAtProgress, polylineLength } from './polyline-pulse'

// Una "L": (0,0) → (10,0) → (10,10). Largo total = 20.
const L = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 10 },
]

describe('polylineLength', () => {
  it('suma los segmentos', () => {
    expect(polylineLength(L)).toBe(20)
  })

  it('polilínea vacía o de un punto mide 0', () => {
    expect(polylineLength([])).toBe(0)
    expect(polylineLength([{ x: 5, y: 5 }])).toBe(0)
  })
})

describe('pointAtDistance', () => {
  it('clampea al inicio y al fin', () => {
    expect(pointAtDistance(L, -5)).toEqual({ x: 0, y: 0 })
    expect(pointAtDistance(L, 999)).toEqual({ x: 10, y: 10 })
  })

  it('interpola dentro del primer segmento', () => {
    expect(pointAtDistance(L, 5)).toEqual({ x: 5, y: 0 })
  })

  it('cruza al segundo segmento', () => {
    expect(pointAtDistance(L, 15)).toEqual({ x: 10, y: 5 })
  })

  it('justo en el vértice', () => {
    expect(pointAtDistance(L, 10)).toEqual({ x: 10, y: 0 })
  })

  it('polilínea vacía devuelve el origen', () => {
    expect(pointAtDistance([], 3)).toEqual({ x: 0, y: 0 })
  })
})

describe('pointAtProgress', () => {
  it('0 = inicio, 1 = fin', () => {
    expect(pointAtProgress(L, 0)).toEqual({ x: 0, y: 0 })
    expect(pointAtProgress(L, 1)).toEqual({ x: 10, y: 10 })
  })

  it('0.5 = mitad del recorrido', () => {
    expect(pointAtProgress(L, 0.5)).toEqual({ x: 10, y: 0 })
  })

  it('clampea fuera de [0,1]', () => {
    expect(pointAtProgress(L, -1)).toEqual({ x: 0, y: 0 })
    expect(pointAtProgress(L, 2)).toEqual({ x: 10, y: 10 })
  })

  it('es puro: mismo input ⇒ mismo output', () => {
    expect(pointAtProgress(L, 0.3)).toEqual(pointAtProgress(L, 0.3))
  })
})
