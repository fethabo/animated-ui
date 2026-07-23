import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

/** Animation state exposed via render prop. */
export interface TiltState {
  /** Current rotation around the X axis in degrees (mouse up/down). */
  tiltX: number
  /** Current rotation around the Y axis in degrees (mouse left/right). */
  tiltY: number
  /** `true` while the cursor is over the card. */
  isHovering: boolean
}

/**
 * Options for the `useTilt` behavior hook. Mirrors `TiltCardProps` minus
 * `glare` (needs an overlay child and a `preserve-3d` context: use the
 * `TiltCard` component) and the wrapper-only props.
 */
export interface UseTiltOptions {
  /** Maximum rotation angle in degrees, on either axis. Default: `15`. */
  maxAngle?: number
  /**
   * 3D perspective depth in px, applied inside the element's own transform.
   * Default: `1000`.
   */
  perspective?: number
  /**
   * If `false`, the tilt runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true`.
   */
  respectReducedMotion?: boolean
}

export interface TiltCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Maximum rotation angle in degrees, on either axis. Default: `15`. */
  maxAngle?: number
  /**
   * 3D perspective depth in px. Default: `1000`.
   * Also controllable via CSS: `--aui-tilt-perspective` overrides this value.
   */
  perspective?: number
  /** If `true`, adds a specular glare overlay that follows the inverted tilt. Default: `false`. */
  glare?: boolean
  /**
   * If `false`, the tilt runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, tiltX/tiltY
   * stay at 0 but `isHovering` keeps working).
   */
  respectReducedMotion?: boolean
  /** Card content: React nodes or a `(state: TiltState) => ReactNode` function. */
  children?: ReactNode | ((state: TiltState) => ReactNode)
  className?: string
  style?: CSSProperties
}
