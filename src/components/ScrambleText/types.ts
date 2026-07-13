import type { HTMLAttributes } from 'react'

export type ScrambleTrigger = 'mount' | 'hover' | 'both'

export interface ScrambleTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Final text to reveal. It is a plain string (not `children`): the scrambler
   * operates character by character and cannot scramble elements.
   */
  text: string
  /** Characters revealed per second. Default: `25`. */
  speed?: number
  /** Pool of random characters shown during the scramble. */
  charset?: string
  /**
   * What triggers the scramble. `'mount'` animates on mount and when `text`
   * changes; `'hover'` re-animates on each `mouseenter`; `'both'` combines both.
   * Default: `'mount'`.
   */
  trigger?: ScrambleTrigger
  /**
   * Color of the characters while the scramble lasts. Default:
   * `currentColor`. Also via `--aui-scramble-color`.
   */
  scrambleColor?: string
  /**
   * If `false`, the autonomous reveal (mount, `text` change) runs even when
   * the system has `prefers-reduced-motion` enabled. Default: `true`
   * (with reduce, the final text is shown directly; the `hover` trigger stays
   * active because it responds to direct user input).
   */
  respectReducedMotion?: boolean
}
