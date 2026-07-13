import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'

/** Enter animation preset for new keys. */
export type AnimatedListEnterPreset = 'fade' | 'scale-in' | 'slide' | 'none'

/** Exit animation preset for removed keys (animates a static clone). */
export type AnimatedListExitPreset = 'fade' | 'scale-out' | 'none'

export interface AnimatedListProps extends HTMLAttributes<HTMLElement> {
  /**
   * Keyed children of the list: each child needs a stable React `key`
   * (as in any list). New keys animate their entrance, removed keys their
   * exit, and persistent keys their reordering (FLIP).
   */
  children?: ReactNode
  /** Duration of each animation (FLIP, enter, exit) in seconds. Default: `0.35`. */
  duration?: number
  /** Easing of the animations. Default: `'ease'`. Also via `--aui-animated-list-easing`. */
  easing?: string
  /** Enter preset for new keys. Default: `'fade'`. */
  enter?: AnimatedListEnterPreset
  /** Exit preset for removed keys. Default: `'fade'`. */
  exit?: AnimatedListExitPreset
  /** Seconds of incremental delay between simultaneous entrances. Default: `0`. */
  stagger?: number
  /** Root element (`'ul'`, `'div'`, …). Default: `'div'`. */
  as?: ElementType
  /** Extra class for each child's measurable wrapper (the "cell" in a grid/flex). */
  itemClassName?: string
  /** Extra inline style for each child's measurable wrapper. */
  itemStyle?: CSSProperties
  /**
   * If `false`, the list animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, changes
   * apply immediately: no FLIP, no enters/exits, no clones).
   */
  respectReducedMotion?: boolean
}
