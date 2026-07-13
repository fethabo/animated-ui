/*
 * Lógica pura del emisor de ImageTrail — sin DOM, testeable de forma aislada.
 * Decide cuándo emitir (umbral de distancia recorrida), qué imagen emitir
 * (rotación cíclica del pool en orden) y si el cap de nodos vivos lo permite.
 */

export interface ImageEmitterState {
  /** Última muestra del puntero, o `null` al entrar/reingresar al contenedor. */
  last: { x: number; y: number } | null
  /** Distancia recorrida desde la última emisión, en px. */
  traveled: number
  /** Índice de la próxima imagen del pool (rotación cíclica). */
  nextIndex: number
}

export function createImageEmitterState(): ImageEmitterState {
  return { last: null, traveled: 0, nextIndex: 0 }
}

export interface AdvanceImageEmitterOptions {
  /** Umbral de emisión en px de recorrido. */
  emitEvery: number
  /** Cantidad de imágenes del pool. */
  imageCount: number
  /** Nodos de imagen actualmente vivos en el DOM. */
  liveCount: number
  /** Cap de nodos vivos: alcanzado, la emisión espera. */
  maxConcurrent: number
}

export interface ImageEmission {
  x: number
  y: number
  /** Índice de la imagen a emitir dentro del pool. */
  index: number
}

/**
 * Avanza el emisor con una muestra nueva del puntero. Emite a lo sumo **una**
 * imagen por muestra (en el punto actual) cuando el recorrido acumulado supera
 * `emitEvery`; el excedente no se acumula en ráfaga (a diferencia de un trail
 * de partículas, acá cada emisión es un nodo DOM). Con el cap `maxConcurrent`
 * alcanzado no emite y el recorrido acumulado queda esperando a que un nodo
 * muera. Retorna `null` si no corresponde emitir.
 */
export function advanceImageEmitter(
  state: ImageEmitterState,
  x: number,
  y: number,
  { emitEvery, imageCount, liveCount, maxConcurrent }: AdvanceImageEmitterOptions,
): ImageEmission | null {
  const last = state.last
  state.last = { x, y }
  if (!last || imageCount <= 0) return null

  state.traveled += Math.hypot(x - last.x, y - last.y)
  if (state.traveled < emitEvery) return null
  if (liveCount >= maxConcurrent) return null

  state.traveled = 0
  const index = state.nextIndex % imageCount
  state.nextIndex = (index + 1) % imageCount
  return { x, y, index }
}

/** Reinicia el recorrido del emisor (el puntero salió del contenedor). */
export function resetImageEmitter(state: ImageEmitterState): void {
  state.last = null
  state.traveled = 0
}
