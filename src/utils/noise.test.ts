import { describe, expect, it } from 'vitest'
// @ts-expect-error — import ?raw de Vite (el fuente como string, sin tipos)
import noiseSource from './noise.ts?raw'
import { createNoise2D, fbm } from './noise'

describe('createNoise2D', () => {
  it('es determinista: la misma seed produce los mismos valores', () => {
    const a = createNoise2D('wave-h')
    const b = createNoise2D('wave-h')
    for (let i = 0; i < 200; i++) {
      const x = i * 0.37
      const y = i * 0.61
      expect(a(x, y)).toBe(b(x, y))
    }
  })

  it('seeds distintas producen campos distintos', () => {
    const a = createNoise2D('seed-1')
    const b = createNoise2D('seed-2')
    let differences = 0
    for (let i = 0; i < 100; i++) {
      if (a(i * 0.31, i * 0.17) !== b(i * 0.31, i * 0.17)) differences++
    }
    expect(differences).toBeGreaterThan(90)
  })

  it('mantiene el rango [-1, 1] sobre un muestreo denso', () => {
    const noise = createNoise2D(42)
    for (let i = 0; i < 5000; i++) {
      const v = noise(i * 0.113, i * 0.071)
      expect(v).toBeGreaterThanOrEqual(-1)
      expect(v).toBeLessThanOrEqual(1)
    }
  })

  it('no es constante (produce variación real)', () => {
    const noise = createNoise2D('flat-check')
    const values = new Set<number>()
    for (let i = 0; i < 100; i++) values.add(noise(i * 0.29, i * 0.53))
    expect(values.size).toBeGreaterThan(50)
  })

  it('es continuo: muestras vecinas quedan acotadas', () => {
    const noise = createNoise2D('continuity')
    const epsilon = 0.01
    for (let i = 0; i < 500; i++) {
      const x = i * 0.41
      const y = i * 0.23
      const delta = Math.abs(noise(x + epsilon, y) - noise(x, y))
      // El gradiente máximo del simplex es acotado; con ε=0.01 el salto
      // debe ser una fracción pequeña del rango total.
      expect(delta).toBeLessThan(0.1)
    }
  })

  it('es razonablemente isótropo: varianza similar por eje', () => {
    const noise = createNoise2D('isotropy')
    const variance = (samples: number[]) => {
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length
      return samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length
    }
    const alongX: number[] = []
    const alongY: number[] = []
    for (let i = 0; i < 2000; i++) {
      alongX.push(noise(i * 0.19, 3.7))
      alongY.push(noise(3.7, i * 0.19))
    }
    const ratio = variance(alongX) / variance(alongY)
    expect(ratio).toBeGreaterThan(0.5)
    expect(ratio).toBeLessThan(2)
  })
})

describe('fbm', () => {
  it('preserva la firma y el determinismo del ruido base', () => {
    const fractalA = fbm(createNoise2D('fbm-seed'), 4)
    const fractalB = fbm(createNoise2D('fbm-seed'), 4)
    for (let i = 0; i < 100; i++) {
      const v = fractalA(i * 0.21, i * 0.13)
      expect(typeof v).toBe('number')
      expect(v).toBe(fractalB(i * 0.21, i * 0.13))
    }
  })

  it('mantiene el rango [-1, 1]', () => {
    const fractal = fbm(createNoise2D('fbm-range'), 5)
    for (let i = 0; i < 2000; i++) {
      const v = fractal(i * 0.093, i * 0.067)
      expect(v).toBeGreaterThanOrEqual(-1)
      expect(v).toBeLessThanOrEqual(1)
    }
  })

  it('agrega detalle de alta frecuencia respecto del ruido base', () => {
    const base = createNoise2D('fbm-detail')
    const fractal = fbm(base, 4)
    // La derivada discreta promedio del fractal debe superar la del base
    // (las octavas suman variación fina).
    const roughness = (fn: (x: number, y: number) => number) => {
      let sum = 0
      for (let i = 0; i < 500; i++) {
        sum += Math.abs(fn(i * 0.05 + 0.025, 1.3) - fn(i * 0.05, 1.3))
      }
      return sum
    }
    expect(roughness(fractal)).toBeGreaterThan(roughness(base))
  })
})

describe('restricciones del paquete', () => {
  it('noise.ts no usa Math.random ni Date.now', () => {
    expect(noiseSource).not.toMatch(/Math\.random/)
    expect(noiseSource).not.toMatch(/Date\.now/)
  })
})
