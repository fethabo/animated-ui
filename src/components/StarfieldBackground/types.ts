import type { HTMLAttributes } from 'react'

export interface StarfieldBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Sky seed: the same `seed` + dimensions always produce the
   * same star field (no `Math.random`). Default: `'aui'`.
   */
  seed?: string | number
  /** Multiplier for star density per area. Default: `1`. */
  density?: number
  /**
   * Star palette: each star picks a random color (deterministic).
   * Default: `['#ffffff', '#bfdbfe', '#fde68a']`. Also via
   * `--aui-starfield-color-<i>`.
   */
  colors?: string[]
  /** Base sky color. Default: `'#050514'`. Also via `--aui-starfield-background`. */
  background?: string
  /** Twinkle speed (dimensionless factor; `0` freezes it). Default: `1`. */
  speed?: number
  /**
   * Average frequency of shooting stars, in shooting stars per minute. `0`
   * disables them. Default: `8`.
   */
  shootingStars?: number
  /**
   * If `true`, uses `position: fixed` to cover the full viewport.
   * Default: `false` (`position: absolute`, covers the `relative` parent).
   */
  fixed?: boolean
  /**
   * If `false`, the animation runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the static
   * field is painted with no twinkling or shooting stars, no RAF).
   */
  respectReducedMotion?: boolean
}
