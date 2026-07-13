import type { HTMLAttributes } from 'react'

export interface WavesBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of lines distributed vertically. Default: `24`. */
  lines?: number
  /** Wave amplitude in px. Default: `24`. */
  amplitude?: number
  /**
   * Speed of the field's temporal drift (dimensionless factor; `0`
   * freezes the waving). Default: `1`.
   */
  speed?: number
  /**
   * Line palette: with more than one color, each line interpolates its color
   * by its vertical position between the palette's endpoints. Default:
   * `['#22d3ee', '#a78bfa']`. Also via `--aui-waves-color-<i>`.
   */
  colors?: string[]
  /** Line thickness in px. Default: `1.5`. Also via `--aui-waves-line-width`. */
  lineWidth?: number
  /**
   * Noise field seed: the same `seed` + dimensions always produce
   * the same waves (no `Math.random`). Default: `'aui'`.
   */
  seed?: string | number
  /**
   * If `false`, the animation runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the lines
   * are drawn curved but motionless, no RAF).
   */
  respectReducedMotion?: boolean
}
