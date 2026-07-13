import type { HTMLAttributes } from 'react'

export interface MatrixRainProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Rain seed: the same `seed` + dimensions always produce the same
   * column layout and sequence (no `Math.random`). Default:
   * `'aui'`.
   */
  seed?: string | number
  /**
   * Possible glyphs (a string; each character is a glyph). Default: digits
   * + ASCII uppercase + simple katakana.
   */
  charset?: string
  /** Rain color (the glyph trail). Default: `'#22c55e'`. Also via `--aui-matrix-color`. */
  color?: string
  /** Color of each column's bright head. Default: `'#d9ffe3'`. Also via `--aui-matrix-head-color`. */
  headColor?: string
  /**
   * Background color. The component **paints its own background** (the trail's
   * fade overlay requires it). Default: `'#040905'`. Also via `--aui-matrix-background`.
   */
  background?: string
  /**
   * Glyph size in px: determines the grid (larger = fewer
   * columns — a performance lever). Default: `16`.
   */
  fontSize?: number
  /** Fall speed (dimensionless factor). Default: `1`. */
  speed?: number
  /**
   * If `true`, uses `position: fixed` to cover the full viewport.
   * Default: `false` (`position: absolute`, covers the `relative` parent).
   */
  fixed?: boolean
  /**
   * If `false`, the animation runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, a static
   * frame of pre-drawn columns is painted, no RAF).
   */
  respectReducedMotion?: boolean
}
