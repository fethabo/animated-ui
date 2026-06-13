/*
 * Lógica pura del dithering ordered de ImageDissolve — sin DOM ni canvas.
 *
 * Trabaja sobre buffers RGBA planos (`Uint8ClampedArray`, formato de
 * `ImageData.data`): para cada píxel decide si ya cruzó el threshold Bayer
 * según el progreso, eligiendo el píxel de la imagen destino o de la origen.
 * `ImageData` satisface `PixelBuffer` estructuralmente, así que el componente
 * pasa sus `ImageData` reales y los tests pasan objetos planos sin tocar el DOM.
 */

export interface PixelBuffer {
  readonly data: Uint8ClampedArray
  readonly width: number
  readonly height: number
}

export interface DissolveFrameResult {
  data: Uint8ClampedArray
  width: number
  height: number
}

/**
 * Calcula el buffer RGBA del frame actual de la transición. Un píxel `(x, y)`
 * muestra la imagen destino si `threshold(y, x) <= progress`, si no la origen.
 *
 * - `progress = 0` → todos los thresholds (todos > 0) quedan por encima:
 *   solo se ve la imagen origen.
 * - `progress = 1` → todos los thresholds (todos < 1) quedan por debajo:
 *   solo se ve la imagen destino.
 *
 * `from` y `to` deben compartir dimensiones; se usan las de `from`.
 */
export function dissolveFrame(
  from: PixelBuffer,
  to: PixelBuffer,
  progress: number,
  threshold: (row: number, col: number) => number,
): DissolveFrameResult {
  const { width, height } = from
  const out = new Uint8ClampedArray(from.data.length)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const source = threshold(y, x) <= progress ? to.data : from.data
      const i = (y * width + x) * 4
      out[i] = source[i]
      out[i + 1] = source[i + 1]
      out[i + 2] = source[i + 2]
      out[i + 3] = source[i + 3]
    }
  }

  return { data: out, width, height }
}
