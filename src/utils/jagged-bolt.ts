/*
 * Generador de "rayo jagged" (arco eléctrico): una polilínea quebrada entre un
 * origen y un destino, vía subdivisión recursiva por desplazamiento de punto
 * medio (midpoint-displacement). Cada midpoint se desvía perpendicularmente al
 * segmento por una cantidad aleatoria que decae con la profundidad, dando el
 * aspecto fractal de un relámpago. La aleatoriedad viene del PRNG seedable del
 * paquete (no `Math.random()`). Lo usan `TeslaCoil` y la estética `lightning`
 * de `GuidingBranches`. Módulo puro, sin estado ni DOM. Interno al paquete.
 */
import type { Prng } from './prng'

export interface Point {
  x: number
  y: number
}

export interface BoltOptions {
  /** Magnitud (px) de la desviación perpendicular inicial del trazo. */
  jitter: number
  /**
   * Profundidad de subdivisión: el resultado tiene `2^detail` segmentos
   * (`2^detail + 1` puntos). Default: `4`.
   */
  detail?: number
}

/**
 * Genera una polilínea quebrada de `from` a `to`. Los extremos quedan fijos
 * (`from`/`to` exactos); los puntos intermedios se desplazan con jitter
 * seedado. Determinista: el mismo `rng` (misma seed/secuencia) produce el mismo
 * rayo.
 */
export function jaggedBolt(rng: Prng, from: Point, to: Point, { jitter, detail = 4 }: BoltOptions): Point[] {
  let points: Point[] = [{ ...from }, { ...to }]
  let amplitude = jitter
  for (let d = 0; d < detail; d++) {
    const next: Point[] = [points[0]]
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1]
      const b = points[i]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const len = Math.hypot(dx, dy) || 1
      // Normal unitaria al segmento.
      const nx = -dy / len
      const ny = dx / len
      const offset = (rng() * 2 - 1) * amplitude
      next.push({ x: (a.x + b.x) / 2 + nx * offset, y: (a.y + b.y) / 2 + ny * offset })
      next.push(b)
    }
    points = next
    amplitude *= 0.5 // la desviación decae con la profundidad
  }
  return points
}
