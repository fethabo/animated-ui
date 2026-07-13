import type { HTMLAttributes } from 'react'

export interface HorizontalScrollSectionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Multiplier of the vertical travel: how much scroll it takes to
   * complete the horizontal movement (extra height = horizontal
   * travel × `speed`). Higher ⇒ slower movement. Default: `1`.
   */
  speed?: number
  /**
   * Easing of the scroll→movement mapping: receives the linear progress (`0–1`)
   * and returns the effective progress. Default: identity (linear).
   */
  easing?: (progress: number) => number
  /**
   * If `false`, the scroll→transform coupling operates even when the system
   * has `prefers-reduced-motion` enabled. Default: `true` (with reduce, the
   * panels stack vertically like normal sections).
   */
  respectReducedMotion?: boolean
}
