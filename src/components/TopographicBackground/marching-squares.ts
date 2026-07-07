/*
 * Marching squares puro — sin DOM ni canvas. Extrae los segmentos de la
 * isolínea `threshold` de un campo escalar muestreado sobre una grilla de
 * celdas (no por pixel): cada celda se clasifica por sus 4 esquinas y el
 * cruce se interpola linealmente sobre las aristas, así las curvas quedan
 * suaves y sin artefactos de grilla. El componente escala los segmentos
 * (en unidades de muestra) al tamaño de celda en px.
 */

export interface ContourSegment {
  x1: number
  y1: number
  x2: number
  y2: number
}

/**
 * Punto de cruce de la isolínea sobre una arista, interpolando linealmente
 * entre los valores de sus extremos. `a`/`b` nunca están del mismo lado del
 * umbral cuando se invoca (lo garantiza la tabla de casos).
 */
function crossing(a: number, b: number, threshold: number): number {
  const span = b - a
  if (span === 0) return 0.5
  return (threshold - a) / span
}

/**
 * Extrae los segmentos de contorno del nivel `threshold` sobre `values`, una
 * grilla de muestras `[fila][columna]` (por lo tanto `filas-1 × columnas-1`
 * celdas). Retorna segmentos en coordenadas de muestra (1 unidad = 1 celda);
 * los casos ambiguos (5/10) se resuelven con el par de segmentos estándar.
 * Determinista: mismas muestras y umbral ⇒ mismos segmentos.
 */
export function marchingSquares(values: number[][], threshold: number): ContourSegment[] {
  const segments: ContourSegment[] = []
  const rows = values.length - 1
  if (rows < 1) return segments
  const cols = values[0].length - 1

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = values[r][c]
      const tr = values[r][c + 1]
      const br = values[r + 1][c + 1]
      const bl = values[r + 1][c]

      let caseIndex = 0
      if (tl > threshold) caseIndex |= 8
      if (tr > threshold) caseIndex |= 4
      if (br > threshold) caseIndex |= 2
      if (bl > threshold) caseIndex |= 1
      if (caseIndex === 0 || caseIndex === 15) continue

      // Puntos de cruce por arista (solo se usan los que la tabla pide).
      const top = () => ({ x: c + crossing(tl, tr, threshold), y: r })
      const right = () => ({ x: c + 1, y: r + crossing(tr, br, threshold) })
      const bottom = () => ({ x: c + crossing(bl, br, threshold), y: r + 1 })
      const left = () => ({ x: c, y: r + crossing(tl, bl, threshold) })

      const add = (p: { x: number; y: number }, q: { x: number; y: number }) => {
        segments.push({ x1: p.x, y1: p.y, x2: q.x, y2: q.y })
      }

      switch (caseIndex) {
        case 1:
          add(left(), bottom())
          break
        case 2:
          add(bottom(), right())
          break
        case 3:
          add(left(), right())
          break
        case 4:
          add(top(), right())
          break
        case 5: // ambiguo: dos segmentos
          add(top(), left())
          add(bottom(), right())
          break
        case 6:
          add(top(), bottom())
          break
        case 7:
          add(top(), left())
          break
        case 8:
          add(top(), left())
          break
        case 9:
          add(top(), bottom())
          break
        case 10: // ambiguo: dos segmentos
          add(top(), right())
          add(left(), bottom())
          break
        case 11:
          add(top(), right())
          break
        case 12:
          add(left(), right())
          break
        case 13:
          add(bottom(), right())
          break
        case 14:
          add(left(), bottom())
          break
      }
    }
  }
  return segments
}

/**
 * Muestrea un campo escalar sobre una grilla de `(rows+1) × (cols+1)` puntos
 * (las esquinas de `rows × cols` celdas), listo para `marchingSquares`.
 */
export function sampleGrid(
  cols: number,
  rows: number,
  field: (col: number, row: number) => number,
): number[][] {
  const values: number[][] = []
  for (let r = 0; r <= rows; r++) {
    const row: number[] = []
    for (let c = 0; c <= cols; c++) row.push(field(c, r))
    values.push(row)
  }
  return values
}
