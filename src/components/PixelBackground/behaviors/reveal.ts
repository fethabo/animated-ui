import type { PixelBehavior } from '../types'
import { bayerThreshold } from '../../../utils/bayer-matrix'

export interface RevealBehaviorOptions {
  /** Duración total del reveal en milisegundos. */
  duration: number
}

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

      const threshold = bayerThreshold(cell.row, cell.col)
      // Rampa de ~6% del progreso total para que cada celda haga fade-in
      // rápido en lugar de aparecer en un solo frame, sin romper el orden.
      return Math.min(Math.max((progress - threshold) * 16, 0), 1)
    },
  }
}
