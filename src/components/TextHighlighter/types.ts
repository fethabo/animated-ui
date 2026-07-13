import type { HTMLAttributes, ReactNode } from 'react'

export type HighlighterShape =
  | 'underline'
  | 'wavy-underline'
  | 'circle'
  | 'highlight'
  | 'strike'
  | 'box'

export type HighlighterTrigger = 'in-view' | 'mount' | 'hover'

export interface TextHighlighterProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Text (or inline content) to highlight. It stays intact: real, selectable and readable. */
  children: ReactNode
  /** Marker shape. Default: `'underline'`. */
  shape?: HighlighterShape
  /** Stroke color. Default: `currentColor`. Also via `--aui-highlighter-color`. */
  color?: string
  /**
   * Stroke width in px. Default: `3` (`highlight` uses `1em`: the band
   * covers the text height). Also via `--aui-highlighter-stroke-width`.
   */
  strokeWidth?: number
  /** Drawing duration in seconds. Default: `0.9`. Also via `--aui-highlighter-duration`. */
  duration?: number
  /** Seconds to wait before drawing. Default: `0`. Also via `--aui-highlighter-delay`. */
  delay?: number
  /**
   * What triggers the drawing: `'in-view'` on entering the viewport (via
   * IntersectionObserver), `'mount'` on mount, `'hover'` when the pointer
   * enters. Default: `'in-view'`.
   */
  trigger?: HighlighterTrigger
  /**
   * If `true` (default), the shape stays drawn after the first trigger.
   * With `false`, it un-draws on leaving the viewport (or hover) and
   * redraws on re-entering.
   */
  once?: boolean
  /**
   * Seed for the hand-drawn jitter: the same seed and size produce the same
   * stroke. Default: stable per instance.
   */
  seed?: string | number
  /**
   * If `false`, the drawing animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the shape
   * appears fully drawn immediately when triggered, without animation).
   */
  respectReducedMotion?: boolean
}
