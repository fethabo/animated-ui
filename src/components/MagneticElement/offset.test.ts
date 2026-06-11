import { describe, expect, it } from 'vitest'
import { magneticOffset } from './offset'

describe('magneticOffset', () => {
  it('cursor en el centro → offset cero', () => {
    expect(magneticOffset(100, 50, 200, 100, 0.35)).toEqual({ offsetX: 0, offsetY: 0 })
  })

  it('cursor en el borde derecho → desplazamiento máximo horizontal', () => {
    const { offsetX, offsetY } = magneticOffset(200, 50, 200, 100, 0.5)
    expect(offsetX).toBe(50) // mitad del ancho (100) × strength (0.5)
    expect(offsetY).toBe(0)
  })

  it('cursor en la esquina superior izquierda → offsets negativos', () => {
    const { offsetX, offsetY } = magneticOffset(0, 0, 200, 100, 1)
    expect(offsetX).toBe(-100)
    expect(offsetY).toBe(-50)
  })

  it('el offset escala linealmente con strength', () => {
    const weak = magneticOffset(150, 75, 200, 100, 0.2)
    const strong = magneticOffset(150, 75, 200, 100, 0.8)
    expect(strong.offsetX).toBeCloseTo(weak.offsetX * 4)
    expect(strong.offsetY).toBeCloseTo(weak.offsetY * 4)
  })

  it('strength 0 anula el efecto en cualquier posición', () => {
    const { offsetX, offsetY } = magneticOffset(37, 91, 200, 100, 0)
    // toBeCloseTo en vez de toEqual: (37 - 100) * 0 da -0, que toEqual distingue de +0.
    expect(offsetX).toBeCloseTo(0)
    expect(offsetY).toBeCloseTo(0)
  })
})
