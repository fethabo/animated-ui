import type { HTMLAttributes } from 'react'

/** Scroll direction; `up`/`down` for vertical ribbons (columns). */
export type MarqueeDirection = 'left' | 'right' | 'up' | 'down'

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  /** Scroll direction. Default: `'left'`. */
  direction?: MarqueeDirection
  /** Ribbon speed in px/s. Default: `60`. */
  speed?: number
  /**
   * Pauses the animation while the cursor is over the ribbon and resumes it
   * on leave, without jumping. Default: `false`.
   */
  pauseOnHover?: boolean
  /**
   * Opt-in mode: the ribbon speed and a subtle skew respond to the page's
   * scroll velocity (via the package's scroll-driver).
   * Without this prop the component does not subscribe to scroll. Default: `false`.
   */
  scrollVelocity?: boolean
  /** Gap between items and repetitions in px. Default: `24`. Also via `--aui-marquee-gap`. */
  gap?: number
  /** Fades the ribbon edges with a gradient mask. Default: `false`. */
  fadeEdges?: boolean
  /**
   * If `false`, the ribbon scrolls even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, static
   * content in a single pass, no duplicates).
   */
  respectReducedMotion?: boolean
}
