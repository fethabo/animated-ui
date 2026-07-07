/*
 * Cálculo puro del factor de escala del Dock — sin DOM. El componente mide la
 * distancia de cada ítem al cursor sobre el eje del dock y aplica el factor
 * resultante directo al style del ítem.
 */

/**
 * Factor de escala de un ítem según su `distance` (px, con signo o no) al
 * cursor sobre el eje del dock: campana `cos` suave que vale `magnification`
 * en el cursor (`distance = 0`), decrece continuamente y llega exactamente a
 * `1` en `±radius`; fuera del radio (o con parámetros degenerados) es `1`.
 */
export function magnifyScale(distance: number, radius: number, magnification: number): number {
  if (radius <= 0 || magnification <= 1) return 1
  const d = Math.abs(distance)
  if (d >= radius) return 1
  // Campana coseno: 1 en el centro, 0 en el borde del radio, C¹ continua.
  const bell = (Math.cos((d / radius) * Math.PI) + 1) / 2
  return 1 + (magnification - 1) * bell
}
