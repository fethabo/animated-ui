import { describe, expect, it } from 'vitest'
import { hscrollProgress, travelDistance } from './progress'

describe('hscrollProgress', () => {
  // Root de 3000px en viewport de 1000px ⇒ recorrido de 2000px.
  it('mapea el avance del scroll a [0, 1] proporcionalmente', () => {
    expect(hscrollProgress(0, 3000, 1000)).toBe(0)
    expect(hscrollProgress(-1000, 3000, 1000)).toBe(0.5)
    expect(hscrollProgress(-2000, 3000, 1000)).toBe(1)
  })

  it('clampea fuera del recorrido (antes y después de la sección)', () => {
    expect(hscrollProgress(500, 3000, 1000)).toBe(0)
    expect(hscrollProgress(-2500, 3000, 1000)).toBe(1)
  })

  it('es reversible: retroceder el scroll devuelve el progreso anterior', () => {
    const forward = hscrollProgress(-800, 3000, 1000)
    const backward = hscrollProgress(-400, 3000, 1000)
    expect(backward).toBeLessThan(forward)
    expect(backward).toBe(0.2)
  })

  it('sin recorrido (root no más alto que el viewport) retorna 0', () => {
    expect(hscrollProgress(-100, 1000, 1000)).toBe(0)
    expect(hscrollProgress(-100, 800, 1000)).toBe(0)
  })
})

describe('travelDistance', () => {
  it('recorrido = ancho de la fila menos el viewport', () => {
    expect(travelDistance(3200, 1200)).toBe(2000)
  })

  it('fila más angosta que el viewport: sin recorrido', () => {
    expect(travelDistance(800, 1200)).toBe(0)
  })
})
