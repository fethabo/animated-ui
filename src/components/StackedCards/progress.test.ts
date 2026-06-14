import { describe, expect, it } from 'vitest'
import { stackDepth, stackScrolled } from './progress'

describe('stackScrolled', () => {
  it('con el contenedor recién en el pin → 0', () => {
    expect(stackScrolled(0, 0)).toBe(0)
    expect(stackScrolled(80, 80)).toBe(0)
  })

  it('crece a medida que el contenedor sube (containerTop disminuye)', () => {
    expect(stackScrolled(-400, 0)).toBe(400)
    expect(stackScrolled(-320, 80)).toBe(400)
  })

  it('antes del pin (contenedor por debajo del offset) → 0, nunca negativo', () => {
    expect(stackScrolled(500, 0)).toBe(0)
  })
})

describe('stackDepth', () => {
  // 3 cards, cardTravel 400.
  it('en scroll 0 todas las cards están en profundidad 0', () => {
    expect(stackDepth(0, 400, 0, 3)).toBe(0)
    expect(stackDepth(0, 400, 1, 3)).toBe(0)
    expect(stackDepth(0, 400, 2, 3)).toBe(0)
  })

  it('tras scrollear un cardTravel la primera card tiene profundidad 1', () => {
    expect(stackDepth(400, 400, 0, 3)).toBe(1)
    expect(stackDepth(400, 400, 1, 3)).toBe(0) // la segunda recién se fija
  })

  it('interpola fraccional durante la transición', () => {
    expect(stackDepth(200, 400, 0, 3)).toBe(0.5)
  })

  it('clampea: una card no se hunde más allá de las cards que pueden taparla', () => {
    // La card 0 (de 3) puede ser tapada por 2 cards → profundidad máx 2.
    expect(stackDepth(9999, 400, 0, 3)).toBe(2)
    // La última card nunca es tapada → profundidad máx 0.
    expect(stackDepth(9999, 400, 2, 3)).toBe(0)
  })

  it('cardTravel no positivo → profundidad 0 (sin división por cero)', () => {
    expect(stackDepth(400, 0, 0, 3)).toBe(0)
  })
})
