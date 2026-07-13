import type { HTMLAttributes } from 'react'

/** Visual mode of the trail. */
export type CursorTrailMode = 'particles' | 'line'

export interface CursorTrailProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Trail mode. `'particles'` (default): particles with lifetime, fade and
   * slight drift. `'line'`: fluid line through the latest points, with
   * thickness and alpha decreasing toward the tail.
   */
  mode?: CursorTrailMode
  /** Trail color (any CSS color). Default: `'#7c3aed'`. Also via `--aui-cursor-trail-color`. */
  color?: string
  /**
   * Multicolor palette: each particle picks a random color from here (only
   * `mode="particles"`; in `line` the first one is used). Takes precedence
   * over `color`.
   */
  colors?: string[]
  /**
   * Base size in px: particle diameter or thickness of the line head.
   * Default: `8`. Also via `--aui-cursor-trail-size`.
   */
  size?: number
  /**
   * Trail persistence in seconds: lifetime of each particle or maximum age
   * of the line points. Default: `0.6`.
   */
  life?: number
  /** Maximum number of live line points (only `mode="line"`). Default: `36`. */
  length?: number
  /**
   * Emission threshold: px of pointer travel between emissions (distance
   * throttle; smaller movement does not emit). Default: `12`.
   */
  emitEvery?: number
  /**
   * If `false`, the trail is drawn even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the
   * effect is fully disabled: no drawing and no RAF).
   */
  respectReducedMotion?: boolean
}
