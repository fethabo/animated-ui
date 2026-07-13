import type { HTMLAttributes } from 'react'

export interface ShinyTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** Base text color. Default: `#71717a`. Also via `--aui-shiny-color`. */
  color?: string
  /** Color of the shine band that sweeps across the text. Default: `#fafafa`. Also via `--aui-shiny-highlight`. */
  highlight?: string
  /** Seconds per full sweep of the loop. Default: `3`. Also via `--aui-shiny-speed`. */
  speed?: number
  /** Gradient/sweep angle in degrees. Default: `120`. Also via `--aui-shiny-angle`. */
  angle?: number
  /**
   * If `false`, the sweep runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the loop
   * stops and the static gradient remains).
   */
  respectReducedMotion?: boolean
}
