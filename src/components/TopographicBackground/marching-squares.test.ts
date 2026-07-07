import { describe, expect, it } from 'vitest'
import { marchingSquares, sampleGrid, type ContourSegment } from './marching-squares'

describe('marchingSquares', () => {
  it('campo constante: sin contornos (todo de un lado del umbral)', () => {
    const below = sampleGrid(8, 8, () => 0)
    const above = sampleGrid(8, 8, () => 1)
    expect(marchingSquares(below, 0.5)).toHaveLength(0)
    expect(marchingSquares(above, 0.5)).toHaveLength(0)
  })

  it('gradiente vertical: isolínea horizontal interpolada en la altura exacta', () => {
    // values[r][c] = r ⇒ el nivel 2.5 cruza exactamente en y = 2.5.
    const values = sampleGrid(6, 5, (_c, r) => r)
    const segments = marchingSquares(values, 2.5)
    expect(segments.length).toBeGreaterThan(0)
    for (const s of segments) {
      expect(s.y1).toBeCloseTo(2.5, 10)
      expect(s.y2).toBeCloseTo(2.5, 10)
    }
    // Cubre todo el ancho: un segmento por celda.
    expect(segments).toHaveLength(6)
  })

  it('celda única con gradiente horizontal: segmento vertical en el cruce interpolado', () => {
    // tl=0 tr=1 / bl=0 br=1, umbral 0.25 ⇒ cruce en x = 0.25.
    const values = [
      [0, 1],
      [0, 1],
    ]
    const segments = marchingSquares(values, 0.25)
    expect(segments).toHaveLength(1)
    const [s] = segments
    expect(s.x1).toBeCloseTo(0.25, 10)
    expect(s.x2).toBeCloseTo(0.25, 10)
    expect([s.y1, s.y2].sort()).toEqual([0, 1])
  })

  it('campo radial: los cruces quedan sobre el círculo del nivel', () => {
    // Campo = distancia al centro (8, 8); el nivel 5 es un círculo de radio 5.
    const values = sampleGrid(16, 16, (c, r) => Math.hypot(c - 8, r - 8))
    const segments = marchingSquares(values, 5)
    expect(segments.length).toBeGreaterThan(8)
    for (const s of segments) {
      // La interpolación lineal sobre un campo radial es casi exacta: cada
      // endpoint queda a distancia ≈ 5 del centro.
      expect(Math.hypot(s.x1 - 8, s.y1 - 8)).toBeCloseTo(5, 0.5)
      expect(Math.hypot(s.x2 - 8, s.y2 - 8)).toBeCloseTo(5, 0.5)
    }
  })

  it('el contorno radial es una curva cerrada (cada endpoint aparece dos veces)', () => {
    // Centro desplazado de la grilla para que ningún corner caiga exacto
    // sobre el umbral (cruce degenerado en la esquina).
    const values = sampleGrid(16, 16, (c, r) => Math.hypot(c - 8.3, r - 7.6))
    const segments = marchingSquares(values, 4.9)
    const counts = new Map<string, number>()
    const key = (x: number, y: number) => `${x.toFixed(9)},${y.toFixed(9)}`
    for (const s of segments) {
      counts.set(key(s.x1, s.y1), (counts.get(key(s.x1, s.y1)) ?? 0) + 1)
      counts.set(key(s.x2, s.y2), (counts.get(key(s.x2, s.y2)) ?? 0) + 1)
    }
    for (const [, n] of counts) expect(n).toBe(2)
  })

  it('es determinista', () => {
    const field = (c: number, r: number) => Math.sin(c * 0.7) + Math.cos(r * 0.5)
    const a = marchingSquares(sampleGrid(12, 12, field), 0.3)
    const b = marchingSquares(sampleGrid(12, 12, field), 0.3)
    expect(a).toEqual(b)
  })

  it('casos ambiguos (diagonales) producen dos segmentos sin cruzarse', () => {
    // tl y br sobre el umbral, tr y bl debajo ⇒ caso 10.
    const values = [
      [1, 0],
      [0, 1],
    ]
    const segments = marchingSquares(values, 0.5)
    expect(segments).toHaveLength(2)
  })
})

describe('sampleGrid', () => {
  it('produce (rows+1) × (cols+1) muestras', () => {
    const values = sampleGrid(4, 3, (c, r) => c * 10 + r)
    expect(values).toHaveLength(4)
    expect(values[0]).toHaveLength(5)
    expect(values[2][3]).toBe(32)
  })
})

// Utilidad de tipo para asegurar la forma pública del segmento.
const _shape: ContourSegment = { x1: 0, y1: 0, x2: 1, y2: 1 }
void _shape
