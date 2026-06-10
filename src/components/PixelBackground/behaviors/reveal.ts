import type { PixelBehavior } from '../types'

export interface RevealBehaviorOptions {
  /** Duración total del reveal en milisegundos. */
  duration: number
}

// Matriz Bayer 8×8 estándar (ordered dithering). Cada celda de la grilla
// toma su threshold del valor de la matriz en (row % 8, col % 8), lo que
// produce el patrón de materialización dithered característico.
const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]

/**
 * Behavior `reveal`: al montar, las celdas aparecen progresivamente en el
 * orden de la matriz Bayer (ordered dithering), no aleatorio ni wipe lineal.
 *
 * Cada celda tiene un threshold (0..1) según su posición en la matriz; se
 * vuelve visible cuando el progreso global supera su threshold, con una
 * rampa corta para suavizar la aparición individual.
 */
export function createRevealBehavior({ duration }: RevealBehaviorOptions): PixelBehavior {
  const durationSeconds = Math.max(duration, 1) / 1000
  let startTime: number | null = null

  return {
    name: 'reveal',
    mode: 'opacity',
    frame(ctx) {
      if (startTime === null) startTime = ctx.time
    },
    cell(cell, ctx) {
      const elapsed = ctx.time - (startTime ?? ctx.time)
      const progress = Math.min(elapsed / durationSeconds, 1)
      if (progress >= 1) return 1

      const threshold = (BAYER_8[cell.row % 8][cell.col % 8] + 0.5) / 64
      // Rampa de ~6% del progreso total para que cada celda haga fade-in
      // rápido en lugar de aparecer en un solo frame, sin romper el orden.
      return Math.min(Math.max((progress - threshold) * 16, 0), 1)
    },
  }
}
