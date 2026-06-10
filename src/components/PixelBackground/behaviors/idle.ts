import type { PixelBehavior } from '../types'

export interface IdleBehaviorOptions {
  /** Amplitud del parpadeo (0..1). */
  intensity: number
  /** Velocidad del parpadeo (rad/s del seno). */
  speed: number
}

/**
 * Genera un offset de fase determinístico (seeded) por celda, para que cada
 * celda parpadee con un ritmo propio pero estable entre frames y re-renders.
 */
function phaseOffset(col: number, row: number): number {
  const seed = Math.sin(col * 127.1 + row * 311.7) * 43758.5453
  return (seed - Math.floor(seed)) * Math.PI * 2
}

/**
 * Behavior `idle`: parpadeo autónomo y asíncrono de las celdas, como
 * estrellas o ruido vivo. La contribución por celda es
 * `sin(t * speed + offset) * intensity`, donde `offset` es la fase seeded
 * de la celda — oscila entre -intensity y +intensity alrededor del alpha base.
 */
export function createIdleBehavior({ intensity, speed }: IdleBehaviorOptions): PixelBehavior {
  return {
    name: 'idle',
    mode: 'brightness',
    cell(cell, ctx) {
      return Math.sin(ctx.time * speed + phaseOffset(cell.col, cell.row)) * intensity
    },
  }
}
