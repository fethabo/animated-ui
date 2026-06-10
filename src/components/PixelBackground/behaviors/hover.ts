import type { PixelBehavior } from '../types'

export interface HoverBehaviorOptions {
  /** Radio en px dentro del cual las celdas se iluminan. */
  radius: number
}

/**
 * Behavior `hover`: ilumina las celdas según su proximidad al mouse con una
 * caída gaussiana (`exp(-d² / 2σ²)`, σ = radius/2), de modo que el brillo es
 * máximo bajo el cursor y decae suavemente hacia el borde del radio.
 *
 * Cuando el cursor sale del canvas, la iluminación no se corta de golpe:
 * un factor interno decae gradualmente hacia 0 manteniendo la última
 * posición conocida.
 */
export function createHoverBehavior({ radius }: HoverBehaviorOptions): PixelBehavior {
  const sigma = radius / 2
  const denominator = 2 * sigma * sigma

  let lastMouse: { x: number; y: number } | null = null
  // 0..1: qué tan "presente" está el mouse; easea al entrar y al salir.
  let presence = 0

  return {
    name: 'hover',
    mode: 'brightness',
    frame(ctx) {
      if (ctx.mouse) {
        lastMouse = ctx.mouse
        presence = Math.min(1, presence + ctx.delta * 8)
      } else {
        presence = Math.max(0, presence - ctx.delta * 4)
      }
    },
    cell(cell) {
      if (!lastMouse || presence === 0) return 0
      const dx = cell.centerX - lastMouse.x
      const dy = cell.centerY - lastMouse.y
      return Math.exp(-(dx * dx + dy * dy) / denominator) * presence
    },
  }
}
