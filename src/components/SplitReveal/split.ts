/*
 * Lógica pura de partición de SplitReveal — sin DOM, testeable de forma
 * aislada. Parte un string en unidades (char/word) preservando el whitespace,
 * y agrupa unidades por línea dado un mapa de `offsetTop` medido en el cliente.
 */

export interface SplitUnit {
  /** Texto de la unidad (un carácter, una palabra, o un run de espacios). */
  text: string
  /** `true` si la unidad es whitespace (no se anima, solo preserva el espaciado). */
  isSpace: boolean
}

/**
 * Parte el texto en unidades según el modo:
 * - `'char'`: cada code point es una unidad (los espacios son unidades `isSpace`).
 * - `'word'`: runs de no-espacio son palabras; runs de espacio son unidades
 *   `isSpace` que preservan el espaciado entre palabras.
 *
 * Opera por code points para no partir surrogates (emoji). El modo `'line'`
 * se resuelve en el cliente: se parte por palabra y luego se reagrupa con
 * `groupByLine` usando el layout real.
 */
export function splitText(text: string, mode: 'char' | 'word'): SplitUnit[] {
  if (text === '') return []

  if (mode === 'char') {
    return Array.from(text).map((ch) => ({ text: ch, isSpace: /\s/.test(ch) }))
  }

  // Word: runs alternados de espacio / no-espacio, preservando ambos.
  const runs = text.match(/\s+|\S+/gu) ?? []
  return runs.map((run) => ({ text: run, isSpace: /\s/.test(run[0]) }))
}

/**
 * Asigna un índice de línea a cada unidad a partir de su `offsetTop` medido.
 * Unidades consecutivas con el mismo `offsetTop` comparten línea; cada cambio
 * de `offsetTop` incrementa el índice. Permite que el stagger de SplitReveal
 * por línea use este índice (todas las palabras de una línea revelan juntas).
 */
export function groupByLine(offsetTops: number[]): number[] {
  let line = -1
  let prevTop: number | null = null
  return offsetTops.map((top) => {
    if (prevTop === null || top !== prevTop) {
      line += 1
      prevTop = top
    }
    return line
  })
}
