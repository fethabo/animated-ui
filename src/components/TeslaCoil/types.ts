import type { HTMLAttributes, ReactNode } from 'react'

/** Position of the central node, as a fraction of the container (0..1 on each axis). */
export interface CoilOrigin {
  x: number
  y: number
}

export interface TeslaCoilProps extends HTMLAttributes<HTMLDivElement> {
  /** Color of the bolts and the glow (any CSS color). Default: `'#7dd3fc'`. Also via `--aui-tesla-color`. */
  color?: string
  /** Number of ambient bolts emitted from the center. Default: `7`. */
  boltCount?: number
  /** Bolt thickness in px. Default: `2`. Also via `--aui-tesla-line-width`. */
  lineWidth?: number
  /**
   * Regeneration frequency of the ambient bolts in times per second.
   * Default: `12`. Also via `--aui-tesla-frequency`.
   */
  frequency?: number
  /** Maximum reach/length of the bolts in px. Default: `160`. Also via `--aui-tesla-reach`. */
  reach?: number
  /** Magnitude of the jagged deviation of the stroke in px. Default: `18`. Also via `--aui-tesla-jitter`. */
  jitter?: number
  /**
   * Directs extra bolts toward the cursor when it is over the container.
   * Default: `true`. Ignored on touch (no hover).
   */
  followCursor?: boolean
  /**
   * Number of bolts directed at the cursor. Drawn thicker and brighter
   * (with a white core) than the ambient ones. Default: `3`.
   */
  cursorBolts?: number
  /**
   * When cursor-directed bolts fire: `'hover'` (while the cursor
   * is over it, default) or `'click'` (only while pressed).
   */
  cursorTrigger?: 'hover' | 'click'
  /** Position of the central node as a fraction of the container. Default: `{ x: 0.5, y: 0.5 }`. */
  origin?: CoilOrigin
  /**
   * If `true` (default), with `prefers-reduced-motion` the ambient bolts
   * do not regenerate (static frame). Cursor following MAY remain active.
   */
  respectReducedMotion?: boolean
  /** Content overlaid on the effect (the canvas does not intercept its events). */
  children?: ReactNode
}
