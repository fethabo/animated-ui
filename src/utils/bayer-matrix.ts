/*
 * Matriz Bayer 8×8 (ordered dithering) — utilidad interna compartida.
 *
 * Extraída de `PixelBackground/behaviors/reveal.ts` para que tanto ese
 * behavior como `ImageDissolve` consuman la misma fuente de verdad sin
 * acoplarse entre sí (mismo criterio que `scroll-driver.ts`: util interna
 * que se promovería a API pública recién con un tercer consumidor).
 */

/**
 * Matriz Bayer 8×8 estándar. Cada celda contiene un valor en [0, 63] que
 * define el orden en que aparece en el patrón de dithering: los valores más
 * bajos se materializan primero.
 */
export const BAYER_8: readonly (readonly number[])[] = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]

/**
 * Threshold normalizado a [0, 1) de la celda `(row, col)` según la matriz
 * Bayer 8×8. Indexa con módulo 8, de modo que cualquier `(row, col)` mapea
 * a una celda válida (el patrón se repite cada 8 px). El `+ 0.5` centra cada
 * valor en su sub-banda, evitando que la primera celda quede en 0 exacto.
 */
export function bayerThreshold(row: number, col: number): number {
  const r = ((row % 8) + 8) % 8
  const c = ((col % 8) + 8) % 8
  return (BAYER_8[r][c] + 0.5) / 64
}
