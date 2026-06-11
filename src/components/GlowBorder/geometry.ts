/**
 * Ángulo de rotación (en grados) que orienta el inicio del conic-gradient
 * (que arranca arriba, a las 12 en punto) hacia el punto `(x, y)` visto
 * desde el centro `(centerX, centerY)`.
 */
export function pointerAngle(centerX: number, centerY: number, x: number, y: number): number {
  return (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI + 90
}

/**
 * Reexpresa `next` como el ángulo equivalente (módulo 360°) más cercano a
 * `previous`, para que la interpolación tome siempre el camino corto y no
 * dé una vuelta entera al cruzar la discontinuidad de atan2 (±180°).
 */
export function unwrapAngle(previous: number, next: number): number {
  let target = next
  while (target - previous > 180) target -= 360
  while (target - previous < -180) target += 360
  return target
}
