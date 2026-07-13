import type { HTMLAttributes } from 'react'

export interface MouseParallaxProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Seconds of smoothing with which the layers follow the mouse. Default: `0.2`.
   * Also via `--aui-parallax-ease`.
   */
  ease?: number
  /**
   * If `false`, the parallax runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the layers
   * stay static: the effect moves real content).
   */
  respectReducedMotion?: boolean
}

export interface MouseParallaxLayerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum layer offset in px when the cursor is at the container's
   * edge. Positive follows the mouse; negative opposes it (inverted
   * depth). Default: `20`. Also via `--aui-parallax-depth`.
   */
  depth?: number
}
