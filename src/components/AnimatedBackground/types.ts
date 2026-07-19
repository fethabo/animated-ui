import type { CSSProperties, HTMLAttributes } from 'react'

export type AnimatedBackgroundVariantName =
  | 'aurora'
  | 'mesh'
  | 'noise'
  | 'beam'
  | 'lava'
  | 'grid'
  | 'rays'
  | 'dots'
  | 'bubbles'

export interface AnimatedBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the animation. Default: `'aurora'`. */
  variant?: AnimatedBackgroundVariantName
  /**
   * Animation color palette. Each variant uses up to 4 colors;
   * missing ones fall back to the variant's defaults.
   */
  colors?: string[]
  /** Seconds a full animation cycle takes. */
  speed?: number
  /** Global intensity/opacity of the effect, from 0 to 1. Default: 1. */
  intensity?: number
  /**
   * If `true`, uses `position: fixed` to cover the full viewport.
   * Default: `false` (`position: absolute`, covers the `relative` parent).
   */
  fixed?: boolean
  /**
   * If `false`, the animation runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true`.
   */
  respectReducedMotion?: boolean
  className?: string
  style?: CSSProperties
}

/** Internal definition of a variant: static CSS + mapping of props to CSS vars. */
export interface AnimatedBackgroundVariant {
  /** Suffix used in the class name (`aui-<name>`) and in the style tag ID. */
  name: AnimatedBackgroundVariantName
  /** Static CSS (class + keyframes) injected only once. */
  css: string
  /** Maps dynamic props to inline CSS custom properties (overridable via the cascade). */
  cssVars(opts: { colors?: string[]; speed?: number; intensity?: number }): Record<string, string>
}
