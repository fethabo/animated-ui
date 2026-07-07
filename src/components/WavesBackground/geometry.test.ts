import { describe, expect, it } from 'vitest'
import { createNoise2D } from '../../utils/noise'
import { computeWaveLines, interpolatePalette, SAMPLE_SPACING } from './geometry'

const BASE = {
  width: 400,
  height: 300,
  lines: 10,
  amplitude: 20,
  t: 1.5,
  colors: ['#22d3ee', '#a78bfa'],
}

describe('computeWaveLines', () => {
  it('produce la cantidad de líneas pedida, distribuidas verticalmente', () => {
    const result = computeWaveLines({ ...BASE, noise: createNoise2D('w') })
    expect(result).toHaveLength(10)
    // baseY creciente por línea: el primer punto de cada línea queda ordenado
    // (la amplitud es menor que el espaciado vertical de 30 px).
    const firstYs = result.map((l) => l.points[0].y)
    for (let i = 1; i < firstYs.length; i++) {
      expect(firstYs[i]).toBeGreaterThan(firstYs[i - 1])
    }
  })

  it('muestrea espaciado (~8 px), cubriendo todo el ancho', () => {
    const [line] = computeWaveLines({ ...BASE, lines: 1, noise: createNoise2D('w') })
    for (let i = 1; i < line.points.length; i++) {
      expect(line.points[i].x - line.points[i - 1].x).toBeLessThanOrEqual(SAMPLE_SPACING)
    }
    expect(line.points[0].x).toBe(0)
    expect(line.points[line.points.length - 1].x).toBe(400)
  })

  it('la ondulación queda acotada por la amplitud', () => {
    const result = computeWaveLines({ ...BASE, noise: createNoise2D('w') })
    result.forEach((line, i) => {
      const baseY = (300 * (i + 0.5)) / 10
      for (const p of line.points) {
        expect(Math.abs(p.y - baseY)).toBeLessThanOrEqual(20)
      }
    })
  })

  it('es determinista: mismo noise/t/dimensiones ⇒ mismos puntos', () => {
    const a = computeWaveLines({ ...BASE, noise: createNoise2D('same') })
    const b = computeWaveLines({ ...BASE, noise: createNoise2D('same') })
    expect(a).toEqual(b)
  })

  it('el tiempo desplaza el campo: t distinto ⇒ curvas distintas', () => {
    const noise = createNoise2D('drift')
    const a = computeWaveLines({ ...BASE, noise, t: 0 })
    const b = computeWaveLines({ ...BASE, noise, t: 2 })
    expect(a).not.toEqual(b)
  })

  it('interpola el color entre los extremos de la paleta', () => {
    const result = computeWaveLines({ ...BASE, noise: createNoise2D('w') })
    expect(result[0].color).toBe('rgb(34, 211, 238)') // #22d3ee
    expect(result[result.length - 1].color).toBe('rgb(167, 139, 250)') // #a78bfa
  })
})

describe('interpolatePalette', () => {
  it('interpola linealmente entre dos hex', () => {
    expect(interpolatePalette(['#000000', '#ffffff'], 0.5)).toBe('rgb(128, 128, 128)')
  })

  it('con un color, lo retorna siempre', () => {
    expect(interpolatePalette(['#123456'], 0.8)).toBe('#123456')
  })

  it('soporta hex corto (#rgb)', () => {
    expect(interpolatePalette(['#000', '#fff'], 1)).toBe('rgb(255, 255, 255)')
  })

  it('con colores no-hex cae al stop más cercano', () => {
    expect(interpolatePalette(['tomato', 'teal'], 0.2)).toBe('tomato')
    expect(interpolatePalette(['tomato', 'teal'], 0.8)).toBe('teal')
  })

  it('clampea la fracción fuera de rango', () => {
    expect(interpolatePalette(['#000000', '#ffffff'], -1)).toBe('rgb(0, 0, 0)')
    expect(interpolatePalette(['#000000', '#ffffff'], 2)).toBe('rgb(255, 255, 255)')
  })
})
