import type { HTMLAttributes } from 'react'

export interface StickyScenesProps extends HTMLAttributes<HTMLDivElement> {
  /** Scenes declared with `StickyScenes.Scene`. */
  children?: React.ReactNode
  /**
   * Scroll pixels dedicated to each scene before transitioning to the
   * next. Default: `600`. The container's total height is
   * `100dvh + nScenes × sceneDuration`.
   */
  sceneDuration?: number
  /**
   * If `false`, the scene transitions run even when the system
   * has `prefers-reduced-motion` enabled. Default: `true` (with reduce,
   * scroll tracking stays active but transitions are disabled with
   * `transition: none`, showing each scene immediately).
   */
  respectReducedMotion?: boolean
}

export interface StickySceneProps extends HTMLAttributes<HTMLDivElement> {
  /** Scene content. */
  children?: React.ReactNode
}
