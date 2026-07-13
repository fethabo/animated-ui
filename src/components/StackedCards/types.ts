import type { HTMLAttributes, ReactNode } from 'react'

export interface StackedCardsProps extends HTMLAttributes<HTMLDivElement> {
  /** Cards: each direct child is wrapped in a sticky wrapper. */
  children?: ReactNode
  /** Pixels from the top of the viewport where the stack is pinned. Default: `0`. Also via `--aui-stack-offset`. */
  offsetTop?: number
  /** How much each card shrinks per depth level (0–1). Default: `0.05`. Also via `--aui-stack-scale-step`. */
  scaleStep?: number
  /** How much each card darkens per depth level (0–1). Default: `0` (no darkening). Also via `--aui-stack-opacity-step`. */
  opacityStep?: number
  /** Scroll pixels dedicated to each card (defines the travel and the height of each wrapper). Default: `400`. Also via `--aui-stack-travel`. */
  cardTravel?: number
  /**
   * If `false`, the scroll-linked shrinking/darkening runs even when the
   * system has `prefers-reduced-motion` enabled. Default: `true` (with
   * reduce, the cards stay in a static, readable sticky layout, without the
   * scroll-linked transforms).
   */
  respectReducedMotion?: boolean
}
