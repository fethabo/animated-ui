import type { CSSProperties, HTMLAttributes } from 'react'

/** Options for the `useSpotlight` behavior hook. Mirrors `SpotlightCardProps`. */
export interface UseSpotlightOptions {
  /**
   * Spotlight color (any CSS color; using alpha is recommended).
   * Default: `rgba(255, 255, 255, 0.15)`. Also via `--aui-spotlight-color`.
   */
  color?: string
  /** Spotlight radius in px. Default: `250`. Also via `--aui-spotlight-radius`. */
  radius?: number
  /** Maximum overlay opacity on hover (0 to 1). Default: `1`. Also via `--aui-spotlight-opacity`. */
  opacity?: number
  /**
   * Accepted for API consistency. The spotlight responds to direct user
   * input and does not shift content, so it stays active with
   * `prefers-reduced-motion` (same semantics as the component). Default: `true`.
   */
  respectReducedMotion?: boolean
}

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Spotlight color (any CSS color; using alpha is recommended).
   * Default: `rgba(255, 255, 255, 0.15)`. Also via `--aui-spotlight-color`.
   */
  color?: string
  /** Spotlight radius in px. Default: `250`. Also via `--aui-spotlight-radius`. */
  radius?: number
  /** Maximum overlay opacity on hover (0 to 1). Default: `1`. Also via `--aui-spotlight-opacity`. */
  opacity?: number
  /**
   * Accepted for API consistency. The spotlight responds to direct user
   * input and does not shift content, so it stays active with
   * `prefers-reduced-motion` (precedent: PixelBackground's `hover` behavior).
   * Default: `true`.
   */
  respectReducedMotion?: boolean
  className?: string
  style?: CSSProperties
}
