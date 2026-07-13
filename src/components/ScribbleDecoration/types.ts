import type { HTMLAttributes } from 'react'
import type { ScribbleShape, ScribbleShapeName } from './shapes'

export type ScribbleTrigger = 'in-view' | 'mount'

export interface ScribbleDecorationProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Scribble to draw: a builtin name (`'arrow'`, `'asterisk'`,
   * `'spiral'`, `'underline'`, `'circle'`) or a custom function satisfying
   * the `ScribbleShape` contract (`(size, seed, options) => d`). Default: `'arrow'`.
   */
  shape?: ScribbleShapeName | ScribbleShape
  /** Stroke color. Default: `currentColor`. Also via `--aui-scribble-color`. */
  color?: string
  /** Stroke width in px. Default: `3`. Also via `--aui-scribble-stroke-width`. */
  strokeWidth?: number
  /** Draw duration in seconds. Default: `0.9`. Also via `--aui-scribble-duration`. */
  duration?: number
  /** Seconds to wait before drawing. Default: `0`. Also via `--aui-scribble-delay`. */
  delay?: number
  /**
   * What triggers the drawing: `'in-view'` on entering the viewport (via
   * IntersectionObserver), `'mount'` on mount. Default: `'in-view'`.
   */
  trigger?: ScribbleTrigger
  /**
   * If `true` (default), the scribble stays drawn after the first
   * trigger. With `false`, it rewinds when leaving the viewport and redraws
   * on re-entry (only with `trigger='in-view'`).
   */
  once?: boolean
  /**
   * With `true`, the scribble draws, fades out and redraws cyclically
   * while triggered. Default: `false`.
   */
  repeat?: boolean
  /**
   * Seed for the hand-drawn jitter: the same seed, shape and size produce
   * the same scribble. Default: stable per instance.
   */
  seed?: string | number
  /**
   * If `false`, the drawing animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the
   * scribble is shown complete and static, without drawing or loop).
   */
  respectReducedMotion?: boolean
}
