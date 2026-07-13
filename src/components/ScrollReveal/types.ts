import type { HTMLAttributes } from 'react'

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none'

export interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Where the content enters from: `'up'` appears from below moving
   * upward, `'down'` from above, `'left'` from the right, `'right'`
   * from the left, `'none'` fade only. Default: `'up'`.
   */
  direction?: RevealDirection
  /** Initial offset in px. Default: `24`. Also via `--aui-reveal-distance`. */
  distance?: number
  /** Transition duration in seconds. Default: `0.6`. Also via `--aui-reveal-duration`. */
  duration?: number
  /** Seconds of incremental delay between direct children. Default: `0.1`. Also via `--aui-reveal-stagger`. */
  stagger?: number
  /** Fraction of the component that must be visible to trigger the reveal. Default: `0.15`. */
  threshold?: number
  /**
   * If `true` (default), the content stays visible after the first reveal.
   * With `false`, it hides again when leaving the viewport and re-reveals on entry.
   */
  once?: boolean
  /**
   * If `false`, the reveal animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the content
   * is shown directly in its final position, without transition).
   */
  respectReducedMotion?: boolean
}
