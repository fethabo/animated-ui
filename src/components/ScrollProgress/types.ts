import type { HTMLAttributes } from 'react'

export type ScrollProgressPosition = 'top' | 'bottom'

export interface ScrollProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Viewport edge where the bar is fixed. Default: `'top'`. */
  position?: ScrollProgressPosition
  /** Progress bar color. Default: `#7c3aed`. Also via `--aui-progress-color`. */
  color?: string
  /** Bar thickness in px. Default: `3`. Also via `--aui-progress-height`. */
  height?: number
  /** Track color (the bar's background). Default: `transparent`. Also via `--aui-progress-bg`. */
  trackColor?: string
  /** z-index of the fixed element, in case it competes with the consumer's headers. Default: `50`. Also via `--aui-progress-z`. */
  zIndex?: number
  /**
   * Accepted for API consistency; the bar stays active in both cases:
   * it mirrors 1:1 the scroll position the user controls directly
   * (like the native scrollbar) and does not move content. Default: `true`.
   */
  respectReducedMotion?: boolean
}
