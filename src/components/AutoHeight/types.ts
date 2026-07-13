import type { HTMLAttributes, ReactNode } from 'react'

export interface AutoHeightProps extends HTMLAttributes<HTMLDivElement> {
  /** Container content; when it changes size, the height transitions. */
  children?: ReactNode
  /** Transition duration in seconds. Default: `0.3`. */
  duration?: number
  /** Transition easing. Default: `'ease'`. Also via `--aui-autoheight-easing`. */
  easing?: string
  /** Also animate the container's width. Default: `false`. */
  width?: boolean
  /**
   * If `false`, the transition animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the
   * container adjusts immediately keeping `height: auto`).
   */
  respectReducedMotion?: boolean
}
