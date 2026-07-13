import type { HTMLAttributes } from 'react'

export interface ImageDissolveProps extends HTMLAttributes<HTMLDivElement> {
  /** URL of the image to display. Changing it triggers the dithered transition. */
  src: string
  /** Alternative text for the image (required for accessibility). */
  alt: string
  /** Transition duration in milliseconds. Default: `800`. */
  duration?: number
  /**
   * If `false`, the dithered transition runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the `src`
   * is swapped instantly without animating the canvas).
   */
  respectReducedMotion?: boolean
}
