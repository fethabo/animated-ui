import type { HTMLAttributes, ReactNode } from 'react'

export interface RippleContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Content to wrap. Ripples are drawn on top without intercepting interaction. */
  children?: ReactNode
  /** Ripple color. Default: `currentColor`. Also via `--aui-ripple-color`. */
  color?: string
  /**
   * Duration of each ripple (expansion + fade) in ms. Default: `600`.
   * Also via `--aui-ripple-duration`.
   */
  duration?: number
  /**
   * Maximum ripple radius in px. Default: the distance from the click
   * point to the farthest corner of the container (the ripple covers it entirely).
   */
  maxRadius?: number
  /** Initial ripple opacity. Default: `0.25`. Also via `--aui-ripple-opacity`. */
  opacity?: number
  /**
   * If `false`, the ripple expands even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the ripple
   * is replaced by a brief static fade at the click point).
   */
  respectReducedMotion?: boolean
}
