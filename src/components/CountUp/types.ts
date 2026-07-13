import type { HTMLAttributes } from 'react'

export interface CountUpProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'prefix'> {
  /** Final value of the count. It is what SSR renders and the screen reader announces. */
  value: number
  /** Initial value the count starts from. Default: `0`. */
  from?: number
  /** Count duration in ms. Default: `2000`. */
  duration?: number
  /** Number of decimals, stable throughout the count. Default: `0`. */
  decimals?: number
  /** Thousands separator (e.g. `'.'`, `','`). Default: no separator. */
  separator?: string
  /** String prepended to the number (e.g. `'$'`). Default: `''`. */
  prefix?: string
  /** String appended to the number (e.g. `'+'`). Default: `''`. */
  suffix?: string
  /**
   * If `false`, the count animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the
   * final value is shown directly, same as the SSR markup).
   */
  respectReducedMotion?: boolean
}
