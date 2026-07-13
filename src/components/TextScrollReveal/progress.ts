/*
 * Cálculo puro del progreso de encendido de TextScrollReveal — sin DOM,
 * testeable de forma aislada. Remapea el progreso del contenedor por el
 * viewport al rango `offset` donde ocurre el encendido.
 */

/**
 * Progreso de encendido en [0, 1] a partir del progreso del contenedor por
 * el viewport (`viewportProgress` del scroll-driver, en [-1, 1]) y el rango
 * `offset = [inicio, fin]` normalizado a [0, 1] sobre ese recorrido.
 *
 * Antes de `inicio` retorna 0 (todo apagado); después de `fin` retorna 1
 * (todo encendido); entre ambos interpola linealmente. Un rango degenerado
 * (fin <= inicio) actúa como umbral duro en `fin`.
 */
export function revealProgress(viewport: number, offset: readonly [number, number]): number {
  // [-1, 1] → [0, 1]: el recorrido completo del contenedor por el viewport.
  const journey = (viewport + 1) / 2
  const [start, end] = offset
  if (end <= start) return journey >= end ? 1 : 0
  return Math.max(0, Math.min(1, (journey - start) / (end - start)))
}
