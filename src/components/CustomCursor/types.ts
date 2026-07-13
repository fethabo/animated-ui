import type { HTMLAttributes } from 'react'

export interface CustomCursorProps extends HTMLAttributes<HTMLDivElement> {
  /** Diameter of the center dot in px. Default: `8`. Also via `--aui-cursor-dot-size`. */
  dotSize?: number
  /** Diameter of the ring in px. Default: `36`. Also via `--aui-cursor-ring-size`. */
  ringSize?: number
  /** Color of the dot and the ring border (any CSS color). Default: `'#7c3aed'`. Also via `--aui-cursor-color`. */
  color?: string
  /**
   * Elastic lag of the ring in seconds (duration of the transition that makes
   * it chase the dot). Default: `0.15`. Also via `--aui-cursor-lag`.
   */
  lag?: number
  /**
   * Growth factor of the ring over interactive elements (`hover` state).
   * Default: `1.5`. Also via `--aui-cursor-hover-scale`.
   */
  hoverScale?: number
  /**
   * Hides the native cursor **only inside the container** (`cursor: none`
   * scoped; no portals or document-level effects). Default: `true`.
   */
  hideNativeCursor?: boolean
  /**
   * If `false`, the elastic lag is kept even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, dot and
   * ring follow the pointer directly, without transitions).
   */
  respectReducedMotion?: boolean
}
