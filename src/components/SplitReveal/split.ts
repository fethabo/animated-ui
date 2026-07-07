/*
 * Lógica pura de partición de SplitReveal — sin DOM, testeable de forma
 * aislada. El split char/word vive en la util compartida del paquete
 * (`src/utils/split-text.ts`, extraída en Wave F); acá queda el agrupado por
 * línea, que es específico de SplitReveal (usa el layout real medido).
 */

export { splitText, type SplitUnit } from '../../utils/split-text'

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
