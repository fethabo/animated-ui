import type { HTMLAttributes, ReactNode } from 'react'

/**
 * `ClickSpark` is the **declarative** variant of the celebration/feedback
 * category: it exposes no imperative handle — wrap your content and every
 * click inside the container emits sparks at the event point.
 */
export interface ClickSparkProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Palette: each spark picks its color at random from here. Default: golds.
   * Also via `--aui-clickspark-color-<i>`.
   */
  colors?: string[]
  /** Sparks per click. Default: `8`. */
  count?: number
  /** Base length of the spark segment in px. Default: `8`. */
  size?: number
  /** Approximate reach of the burst in px. Default: `40`. */
  radius?: number
  /** Lifetime of each burst in seconds. Default: `0.4`. */
  duration?: number
  /**
   * If `false`, clicks emit sparks even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with the preference
   * active no sparks are emitted: they are non-essential decorative motion;
   * the interactivity of the children stays intact).
   */
  respectReducedMotion?: boolean
  /** Interactive content to wrap (events reach it normally). */
  children?: ReactNode
}
