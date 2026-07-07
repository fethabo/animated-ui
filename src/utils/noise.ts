/*
 * Ruido coherente seedable, zero-deps (ver design.md de Wave H). Simplex 2D
 * propio sobre grilla triangular: isótropo (sin sesgo de eje), continuo y
 * barato por muestra (~decenas de ns). La tabla de permutación se construye
 * con `createPrng`, así que hereda el contrato de determinismo del paquete:
 * misma seed ⇒ mismo campo, estable SSR↔hidratación y entre repaints.
 *
 * El tiempo se inyecta como coordenada (`noise(x, t * speed)`): la animación
 * es un corte deslizante del campo 2D — sin estado temporal acá dentro.
 * Interno al paquete — se promueve a público recién cuando un tercer
 * consumidor externo lo justifique (criterio de `prng.ts`).
 */
import { createPrng } from './prng'

/** Función de ruido 2D: retorna un valor en `[-1, 1]`, determinista por seed. */
export type Noise2D = (x: number, y: number) => number

// Constantes de skew/unskew de la grilla triangular del simplex 2D.
const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6

// Los 12 gradientes del simplex clásico (Gustavson); en 2D solo importan x/y.
const GRAD = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [1, 0], [-1, 0],
  [0, 1], [0, -1], [0, 1], [0, -1],
]

/**
 * Crea una función de ruido simplex 2D determinista a partir de una `seed`.
 * Factory sin estado global: cada componente instancia la suya. El resultado
 * está en `[-1, 1]` (amplitud máxima real ≈ ±0.89) y es continuo en ambos
 * ejes.
 */
export function createNoise2D(seed: string | number): Noise2D {
  // Tabla de permutación 0..255 mezclada con el PRNG seedeado (Fisher-Yates),
  // duplicada para indexar sin `% 256` en los accesos compuestos.
  const rng = createPrng(seed)
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = p[i]
    p[i] = p[j]
    p[j] = tmp
  }
  const perm = new Uint8Array(512)
  const permMod12 = new Uint8Array(512)
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255]
    permMod12[i] = perm[i] % 12
  }

  return (xin: number, yin: number): number => {
    // Skew del punto a la grilla triangular para ubicar la celda simplex.
    const s = (xin + yin) * F2
    const i = Math.floor(xin + s)
    const j = Math.floor(yin + s)
    const t = (i + j) * G2
    const x0 = xin - (i - t)
    const y0 = yin - (j - t)

    // Qué triángulo de la celda: superior o inferior.
    const i1 = x0 > y0 ? 1 : 0
    const j1 = x0 > y0 ? 0 : 1

    const x1 = x0 - i1 + G2
    const y1 = y0 - j1 + G2
    const x2 = x0 - 1 + 2 * G2
    const y2 = y0 - 1 + 2 * G2

    const ii = i & 255
    const jj = j & 255

    // Contribución de cada esquina: kernel radial (t⁴) por gradiente.
    let n = 0
    const t0 = 0.5 - x0 * x0 - y0 * y0
    if (t0 > 0) {
      const g = GRAD[permMod12[ii + perm[jj]]]
      n += t0 * t0 * t0 * t0 * (g[0] * x0 + g[1] * y0)
    }
    const t1 = 0.5 - x1 * x1 - y1 * y1
    if (t1 > 0) {
      const g = GRAD[permMod12[ii + i1 + perm[jj + j1]]]
      n += t1 * t1 * t1 * t1 * (g[0] * x1 + g[1] * y1)
    }
    const t2 = 0.5 - x2 * x2 - y2 * y2
    if (t2 > 0) {
      const g = GRAD[permMod12[ii + 1 + perm[jj + 1]]]
      n += t2 * t2 * t2 * t2 * (g[0] * x2 + g[1] * y2)
    }

    // 70 escala la suma al rango [-1, 1] (máximo teórico ≈ 0.89).
    return 70 * n
  }
}

/**
 * Decorator fBm (fractal Brownian motion): compone `octaves` octavas del
 * ruido base — cada una con frecuencia × `lacunarity` y amplitud × `gain` —
 * y normaliza por la amplitud total, preservando la firma y el rango
 * `[-1, 1]`. Los consumidores no distinguen ruido simple de fractal.
 */
export function fbm(noise: Noise2D, octaves: number, lacunarity = 2, gain = 0.5): Noise2D {
  return (x: number, y: number): number => {
    let sum = 0
    let amplitude = 1
    let frequency = 1
    let total = 0
    for (let o = 0; o < octaves; o++) {
      sum += amplitude * noise(x * frequency, y * frequency)
      total += amplitude
      frequency *= lacunarity
      amplitude *= gain
    }
    return total > 0 ? sum / total : 0
  }
}
