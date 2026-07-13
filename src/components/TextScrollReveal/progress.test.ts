import { describe, expect, it } from 'vitest'
import { revealProgress } from './progress'

// viewport ∈ [-1, 1] (recién asoma → terminó de salir); journey = (v+1)/2.
describe('revealProgress', () => {
  const offset: [number, number] = [0.2, 0.6]

  it('retorna 0 antes del inicio del rango (todo apagado)', () => {
    expect(revealProgress(-1, offset)).toBe(0) // recién asoma por abajo
    expect(revealProgress(-0.7, offset)).toBe(0) // journey 0.15 < 0.2
    expect(revealProgress(-0.6, offset)).toBe(0) // journey 0.2 == inicio
  })

  it('retorna 1 después del fin del rango (todo encendido)', () => {
    expect(revealProgress(0.2, offset)).toBe(1) // journey 0.6 == fin
    expect(revealProgress(0.5, offset)).toBe(1)
    expect(revealProgress(1, offset)).toBe(1) // terminó de salir por arriba
  })

  it('interpola linealmente dentro del rango', () => {
    expect(revealProgress(-0.2, offset)).toBeCloseTo(0.5) // journey 0.4 = mitad de [0.2, 0.6]
    expect(revealProgress(-0.4, offset)).toBeCloseTo(0.25)
    expect(revealProgress(0, offset)).toBeCloseTo(0.75)
  })

  it('es monótona: scrollear siempre avanza (o retrocede) el encendido en orden', () => {
    let prev = -1
    for (let v = -1; v <= 1.001; v += 0.05) {
      const p = revealProgress(v, offset)
      expect(p).toBeGreaterThanOrEqual(prev)
      prev = p
    }
  })

  it('el rango completo [0, 1] mapea el recorrido entero por el viewport', () => {
    expect(revealProgress(-1, [0, 1])).toBe(0)
    expect(revealProgress(0, [0, 1])).toBeCloseTo(0.5)
    expect(revealProgress(1, [0, 1])).toBe(1)
  })

  it('un rango degenerado (fin <= inicio) actúa como umbral duro', () => {
    expect(revealProgress(-0.5, [0.5, 0.5])).toBe(0) // journey 0.25 < 0.5
    expect(revealProgress(0.2, [0.5, 0.5])).toBe(1) // journey 0.6 >= 0.5
    expect(revealProgress(0.2, [0.8, 0.3])).toBe(1) // journey 0.6 >= 0.3
  })
})
