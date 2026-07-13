import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

/** Animation state exposed via render prop. */
export interface MagneticState {
  /** Current horizontal displacement of the content in px. */
  offsetX: number
  /** Current vertical displacement of the content in px. */
  offsetY: number
  /** `true` while the cursor is inside the attraction zone. */
  isActive: boolean
}

export interface MagneticElementProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Attraction strength (0 to 1): how far the content moves toward the cursor. Default: `0.35`. */
  strength?: number
  /**
   * Transparent padding in px that enlarges the attraction zone around
   * the content. Participates in the wrapper's layout; with `0` the wrapper
   * collapses to the content's size. Default: `40`.
   */
  hitArea?: number
  /**
   * If `false`, the attraction runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the content
   * does not move: offsets stay at 0 but `isActive` is still reported).
   */
  respectReducedMotion?: boolean
  /** Content to magnetize: React nodes or a `(state: MagneticState) => ReactNode` function. */
  children?: ReactNode | ((state: MagneticState) => ReactNode)
  className?: string
  style?: CSSProperties
}
