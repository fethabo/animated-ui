import type { HTMLAttributes, ReactNode } from 'react'

export type DrawPathTrigger = 'in-view' | 'mount'

export interface DrawPathProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The consumer's SVG (or markup containing SVGs). It is not restructured:
   * only its stroked elements are measured and given the draw animation,
   * respecting existing `stroke`/`stroke-width`. Elements with
   * `data-aui-no-draw` (or inside a group that has it) stay visible
   * without animating.
   */
  children: ReactNode
  /** Draw duration of each stroke in seconds. Default: `1.2`. Also via `--aui-draw-duration`. */
  duration?: number
  /** Seconds of incremental delay between strokes (document order). Default: `0.15`. Also via `--aui-draw-stagger`. */
  stagger?: number
  /** Seconds to wait before the first stroke. Default: `0`. Also via `--aui-draw-delay`. */
  delay?: number
  /**
   * What triggers the drawing: `'in-view'` on entering the viewport (via
   * IntersectionObserver), `'mount'` on mount. Default: `'in-view'`.
   */
  trigger?: DrawPathTrigger
  /**
   * If `true` (default), the SVG stays drawn after the first trigger.
   * With `false`, the strokes rewind without transition when leaving the
   * viewport and redraw on re-entry (only with `trigger='in-view'`).
   */
  once?: boolean
  /** Visible fraction that triggers the drawing with `trigger='in-view'`. Default: `0.15`. */
  threshold?: number
  /**
   * If `false`, the drawing animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the SVG
   * is shown fully drawn immediately, without animation).
   */
  respectReducedMotion?: boolean
}
