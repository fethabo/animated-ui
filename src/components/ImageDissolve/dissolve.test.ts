import { describe, expect, it } from 'vitest'
import { dissolveFrame, type PixelBuffer } from './dissolve'
import { bayerThreshold } from '../../utils/bayer-matrix'

// Construye un buffer RGBA de `w×h` con todos los píxeles del color dado.
function solid(w: number, h: number, [r, g, b, a]: [number, number, number, number]): PixelBuffer {
  const data = new Uint8ClampedArray(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = r
    data[i * 4 + 1] = g
    data[i * 4 + 2] = b
    data[i * 4 + 3] = a
  }
  return { data, width: w, height: h }
}

const FROM_COLOR: [number, number, number, number] = [255, 0, 0, 255] // rojo
const TO_COLOR: [number, number, number, number] = [0, 0, 255, 255] // azul

describe('dissolveFrame', () => {
  const from = solid(8, 8, FROM_COLOR)
  const to = solid(8, 8, TO_COLOR)

  it('progress=0 muestra solo la imagen origen', () => {
    const { data } = dissolveFrame(from, to, 0, bayerThreshold)
    for (let i = 0; i < data.length; i += 4) {
      expect([data[i], data[i + 1], data[i + 2], data[i + 3]]).toEqual(FROM_COLOR)
    }
  })

  it('progress=1 muestra solo la imagen destino', () => {
    const { data } = dissolveFrame(from, to, 1, bayerThreshold)
    for (let i = 0; i < data.length; i += 4) {
      expect([data[i], data[i + 1], data[i + 2], data[i + 3]]).toEqual(TO_COLOR)
    }
  })

  it('progreso intermedio: solo los píxeles con threshold ≤ progress vienen del destino', () => {
    const progress = 0.5
    const { data, width } = dissolveFrame(from, to, progress, bayerThreshold)
    let blue = 0
    let red = 0
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const i = (y * width + x) * 4
        const isBlue = data[i + 2] === 255 && data[i] === 0
        if (isBlue) {
          // Debe ser un píxel cuyo threshold ya fue superado.
          expect(bayerThreshold(y, x)).toBeLessThanOrEqual(progress)
          blue++
        } else {
          expect(bayerThreshold(y, x)).toBeGreaterThan(progress)
          red++
        }
      }
    }
    // A mitad de camino hay mezcla real de ambas imágenes.
    expect(blue).toBeGreaterThan(0)
    expect(red).toBeGreaterThan(0)
  })

  it('preserva las dimensiones del buffer de origen', () => {
    const result = dissolveFrame(from, to, 0.3, bayerThreshold)
    expect(result.width).toBe(8)
    expect(result.height).toBe(8)
    expect(result.data).toHaveLength(8 * 8 * 4)
  })
})
