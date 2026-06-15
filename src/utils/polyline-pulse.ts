/*
 * Recorrido de una polilínea por longitud de arco: dado un progreso, devuelve
 * la posición de una "cabeza de luz" sobre la polilínea. Lo usa
 * `CircuitBackground` para mover pulsos por las pistas (cabeza + estela que
 * decae detrás). Módulo puro, sin estado ni DOM. Interno al paquete.
 */

export interface Point {
  x: number
  y: number
}

/** Longitud total de la polilínea (suma de los segmentos). */
export function polylineLength(points: Point[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
  }
  return total
}

/**
 * Posición a una distancia de arco `distance` desde el inicio de la polilínea.
 * Clampea a los extremos: `distance <= 0` ⇒ primer punto, `distance >= largo`
 * ⇒ último punto. Devuelve `{x:0,y:0}` si la polilínea está vacía.
 */
export function pointAtDistance(points: Point[], distance: number): Point {
  if (points.length === 0) return { x: 0, y: 0 }
  if (points.length === 1 || distance <= 0) return { ...points[0] }

  let remaining = distance
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const segLen = Math.hypot(b.x - a.x, b.y - a.y)
    if (segLen === 0) continue
    if (remaining <= segLen) {
      const t = remaining / segLen
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    }
    remaining -= segLen
  }
  return { ...points[points.length - 1] }
}

/**
 * Posición a un `progress` en `[0, 1]` a lo largo de la polilínea (0 = inicio,
 * 1 = fin). Clampea fuera de rango. Función pura: mismo input ⇒ mismo output.
 */
export function pointAtProgress(points: Point[], progress: number): Point {
  const length = polylineLength(points)
  const clamped = progress < 0 ? 0 : progress > 1 ? 1 : progress
  return pointAtDistance(points, clamped * length)
}
