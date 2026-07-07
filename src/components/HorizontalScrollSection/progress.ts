/*
 * Mapeos puros de HorizontalScrollSection — sin DOM. El componente mide y
 * suscribe; el progreso del recorrido y el desplazamiento salen de acá.
 */

/**
 * Progreso `0–1` del recorrido sticky: `0` cuando el root todavía no empezó a
 * consumirse (top en el borde superior del viewport), `1` cuando el inner
 * sticky llegó al final del recorrido. Clampeado; sin recorrido retorna 0.
 */
export function hscrollProgress(rectTop: number, rootHeight: number, viewportHeight: number): number {
  const range = rootHeight - viewportHeight
  if (range <= 0) return 0
  return Math.max(0, Math.min(1, -rectTop / range))
}

/**
 * Recorrido horizontal en px: lo que la fila excede al viewport. Fila más
 * angosta que el viewport ⇒ 0 (no hay nada que desplazar).
 */
export function travelDistance(rowSize: number, viewportSize: number): number {
  return Math.max(0, rowSize - viewportSize)
}
