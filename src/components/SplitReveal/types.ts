import type { HTMLAttributes } from 'react'

export type SplitMode = 'char' | 'word' | 'line'
export type SplitPreset = 'fade' | 'slide-up' | 'blur'
export type SplitTrigger = 'mount' | 'in-view'

export interface SplitRevealProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Text to reveal. It is a plain string (not `children`): the component
   * splits it into units. For SEO/SSR it renders in full from the first
   * paint and is split after hydration.
   */
  text: string
  /** Split unit. Default: `'word'`. */
  split?: SplitMode
  /** Entrance animation for each unit. Default: `'slide-up'`. */
  preset?: SplitPreset
  /**
   * What triggers the reveal: `'in-view'` on entering the viewport (via
   * IntersectionObserver), `'mount'` on mount. Default: `'in-view'`.
   */
  trigger?: SplitTrigger
  /** Seconds of incremental delay between units. Default: `0.05`. Also via `--aui-split-stagger`. */
  stagger?: number
  /** Transition duration of each unit, in seconds. Default: `0.6`. Also via `--aui-split-duration`. */
  duration?: number
  /** Initial offset in px for `slide-up`. Default: `16`. Also via `--aui-split-distance`. */
  distance?: number
  /** Visible fraction that triggers the reveal with `trigger='in-view'`. Default: `0.15`. */
  threshold?: number
  /**
   * If `true` (default), the content stays revealed after the first
   * trigger. With `false`, it re-hides on leaving the viewport and re-reveals
   * on re-entering (only with `trigger='in-view'`).
   */
  once?: boolean
  /**
   * If `false`, the reveal animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the full
   * text is shown immediately, with no stagger or animation).
   */
  respectReducedMotion?: boolean
}
