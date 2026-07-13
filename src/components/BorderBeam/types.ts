import type { HTMLAttributes } from 'react'

export interface BorderBeamProps extends HTMLAttributes<HTMLDivElement> {
  /** Color of the comet head. Default: `'#7c3aed'`. Also via `--aui-beam-color-from`. */
  colorFrom?: string
  /** Color of the gradient tail. Default: `'#0ea5e9'`. Also via `--aui-beam-color-to`. */
  colorTo?: string
  /** Comet length in px. Default: `96`. Also via `--aui-beam-size`. */
  size?: number
  /** Seconds per full lap around the perimeter. Default: `6`. Also via `--aui-beam-duration`. */
  duration?: number
  /**
   * Initial offset of the path in seconds (negative starts "already advanced").
   * Useful for desynchronizing multiple instances. Default: `0`.
   */
  delay?: number
  /** Stroke width of the comet (and of the static highlight) in px. Default: `2`. Also via `--aui-beam-border-width`. */
  borderWidth?: number
  /**
   * If `false`, the comet travels the border even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, a subtle
   * static border highlight, no motion).
   */
  respectReducedMotion?: boolean
}
