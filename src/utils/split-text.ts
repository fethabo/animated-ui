/*
 * Split de texto compartido (extraído de SplitReveal en Wave F) — sin DOM,
 * puro. Parte un string en unidades (char/word) preservando el whitespace;
 * lo consumen SplitReveal y WavyText (y los futuros efectos de texto que
 * animen por unidad). Interno al paquete.
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
 * Opera por code points para no partir surrogates (emoji).
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
