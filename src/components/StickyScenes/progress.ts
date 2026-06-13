/*
 * Matemática pura de StickyScenes — sin DOM, testeable de forma aislada.
 * Traduce la geometría del contenedor sticky a un progreso [0,1] y lo
 * descompone en escena activa + progreso dentro de la escena.
 */

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

/**
 * Progreso del scroll dentro del rango sticky del contenedor, normalizado a
 * [0,1]. Con el contenedor recién pegado al tope (`containerTop = 0`) → 0; al
 * llegar al final del recorrido sticky (`containerTop = -(containerHeight -
 * viewportHeight)`) → 1. El rango scrolleable es `containerHeight -
 * viewportHeight`; si no hay overflow, retorna 0 (sin dividir por cero).
 */
export function stickyProgress(
  containerTop: number,
  containerHeight: number,
  viewportHeight: number,
): number {
  const scrollable = containerHeight - viewportHeight
  if (scrollable <= 0) return 0
  return clamp01(-containerTop / scrollable)
}

export interface SceneState {
  sceneIndex: number
  sceneProgress: number
}

/**
 * Descompone el progreso total [0,1] en la escena activa y el progreso [0,1]
 * dentro de ella, dividiendo el recorrido en `nScenes` tramos iguales.
 *
 * - En `totalProgress = 0` → escena 0, progreso 0.
 * - En `totalProgress = 1` → última escena (`nScenes - 1`), progreso 1.
 * - En el límite exacto entre escena `k` y `k+1` → escena `k+1`, progreso 0.
 */
export function sceneAt(totalProgress: number, nScenes: number): SceneState {
  if (nScenes <= 0) return { sceneIndex: 0, sceneProgress: 0 }

  const scaled = clamp01(totalProgress) * nScenes
  let sceneIndex = Math.floor(scaled)
  if (sceneIndex >= nScenes) sceneIndex = nScenes - 1 // progreso == 1
  const sceneProgress = clamp01(scaled - sceneIndex)
  return { sceneIndex, sceneProgress }
}
