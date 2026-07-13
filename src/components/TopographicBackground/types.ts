import type { HTMLAttributes } from 'react'

export interface TopographicBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of contour levels distributed across the field's range. Default: `10`. */
  levels?: number
  /** Contour line color. Default: `'#38bdf8'`. Also via `--aui-topo-color`. */
  color?: string
  /** Contour thickness in px. Default: `1`. Also via `--aui-topo-line-width`. */
  lineWidth?: number
  /**
   * Terrain zoom in px: the larger the `scale`, the broader the relief and
   * the more widely spaced the contours. Default: `220`.
   */
  scale?: number
  /**
   * Speed of the terrain's temporal evolution (gradual deformation).
   * `0` = fixed terrain, no RAF running. Default: `1` (slow).
   */
  speed?: number
  /**
   * Field seed: the same `seed` + dimensions produce the same map
   * (no `Math.random`). Default: `'aui'`.
   */
  seed?: string | number
  /**
   * If `false`, the evolution runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the map is
   * drawn once, static).
   */
  respectReducedMotion?: boolean
}
