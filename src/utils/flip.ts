// Lógica pura del motor FLIP (First-Last-Invert-Play): dado el rect de un
// elemento antes (First) y después (Last) de un cambio de layout, calcular la
// inversión que lo hace partir visualmente de su posición anterior; y dado el
// par de listas de keys de dos renders, clasificar entradas/salidas/persistentes.
// Sin DOM: testeable con rects sintéticos. El play WAAPI vive en flip-play.ts.

/** Subconjunto de `DOMRect` que necesita el cálculo (mockeable en tests). */
export interface FlipRect {
  left: number
  top: number
  width: number
  height: number
}

/** Delta que, aplicado como transform, posiciona el Last sobre el First. */
export interface FlipInversion {
  /** Traslación horizontal en px. */
  dx: number
  /** Traslación vertical en px. */
  dy: number
  /** Factor de escala horizontal (1 si no se pidió escala o no cambió). */
  sx: number
  /** Factor de escala vertical (1 si no se pidió escala o no cambió). */
  sy: number
}

/** Clasificación de keys entre dos renders consecutivos. */
export interface KeyDiff<K> {
  /** Keys presentes en el render nuevo pero no en el anterior. */
  entered: K[]
  /** Keys presentes en el render anterior pero no en el nuevo. */
  exited: K[]
  /** Keys presentes en ambos renders (candidatas a FLIP). */
  persisted: K[]
}

/**
 * Calcula la inversión FLIP entre dos rects: la traslación (y opcionalmente la
 * escala) que lleva al elemento desde su posición nueva (Last) de vuelta a la
 * anterior (First), para luego animarla hacia identidad.
 */
export function invert(first: FlipRect, last: FlipRect, withScale = false): FlipInversion {
  const scaleValid = withScale && last.width > 0 && last.height > 0
  const sx = scaleValid ? first.width / last.width : 1
  const sy = scaleValid ? first.height / last.height : 1
  // Con escala, la inversión se calcula entre centros: transform-origin 50% 50%
  // escala alrededor del centro, así que el delta de esquinas mentiría.
  if (scaleValid) {
    return {
      dx: first.left + first.width / 2 - (last.left + last.width / 2),
      dy: first.top + first.height / 2 - (last.top + last.height / 2),
      sx,
      sy,
    }
  }
  return { dx: first.left - last.left, dy: first.top - last.top, sx, sy }
}

/** `true` si la inversión es visualmente nula (no vale la pena animar). */
export function isIdentity(inversion: FlipInversion, epsilon = 0.5): boolean {
  return (
    Math.abs(inversion.dx) < epsilon &&
    Math.abs(inversion.dy) < epsilon &&
    Math.abs(inversion.sx - 1) < 0.01 &&
    Math.abs(inversion.sy - 1) < 0.01
  )
}

/**
 * Clasifica las keys de dos renders consecutivos: nuevas → entrada, ausentes →
 * salida, presentes en ambos → persistentes (candidatas a FLIP). Preserva el
 * orden de aparición (el del render nuevo para `entered`/`persisted`, el del
 * anterior para `exited`).
 */
export function diffKeys<K>(prev: readonly K[], next: readonly K[]): KeyDiff<K> {
  const prevSet = new Set(prev)
  const nextSet = new Set(next)
  return {
    entered: next.filter((key) => !prevSet.has(key)),
    exited: prev.filter((key) => !nextSet.has(key)),
    persisted: next.filter((key) => prevSet.has(key)),
  }
}
