import type { HTMLAttributes } from 'react'

export interface ParallaxLayersProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * If `false`, the parallax runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the layers
   * stay at their layout position: the effect creates relative motion during
   * scroll, the most sensitive kind for users with vestibular sensitivity).
   */
  respectReducedMotion?: boolean
}

export interface ParallaxLayersLayerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum layer offset in px across the container's travel
   * through the viewport. Positive moves with the scroll (slower
   * than the content: background feel); negative against it. Default: `40`.
   * Also via `--aui-parallax-scroll-depth`.
   */
  depth?: number
}
