import type { CSSProperties, HTMLAttributes } from 'react'

/**
 * Options for the `useGlowBorder` behavior hook. Mirrors `GlowBorderProps`
 * minus the content-wrapper props (`contentClassName`/`contentStyle`): in
 * hook mode there is no inner wrapper, so the host's content must provide
 * its own background to cover the gradient's center. Note the host contract:
 * the hook drives the host's `padding` (it becomes the ring width),
 * `overflow` and `isolation` while attached.
 */
export interface UseGlowBorderOptions {
  /**
   * Conic gradient colors (up to 3); any not provided fall back to the default.
   * Also via `--aui-glow-color-1..3`.
   */
  colors?: string[]
  /** Seconds per full rotation of the loop. Default: `4`. Also via `--aui-glow-speed`. */
  speed?: number
  /** Border ring width in px. Default: `1`. Also via `--aui-glow-width`. */
  width?: number
  /** Outer border-radius in px. Default: `12`. Also via `--aui-glow-radius`. */
  radius?: number
  /** Glow intensity/opacity (0 to 1). Default: `1`. Also via `--aui-glow-opacity`. */
  opacity?: number
  /**
   * If `true`, instead of the autonomous loop the gradient points toward the
   * cursor, interpolated with momentum (WAAPI). Default: `false`.
   */
  followCursor?: boolean
  /**
   * If `false`, the autonomous loop runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the loop stops
   * and the gradient remains static; `followCursor` stays active since it responds
   * to direct user input).
   */
  respectReducedMotion?: boolean
}

export interface GlowBorderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Conic gradient colors (up to 3); any not provided fall back to the default.
   * Also via `--aui-glow-color-1..3`.
   */
  colors?: string[]
  /** Seconds per full rotation of the loop. Default: `4`. Also via `--aui-glow-speed`. */
  speed?: number
  /** Border ring width in px. Default: `1`. Also via `--aui-glow-width`. */
  width?: number
  /** Outer border-radius in px (the inner one is computed automatically). Default: `12`. Also via `--aui-glow-radius`. */
  radius?: number
  /** Glow intensity/opacity (0 to 1). Default: `1`. Also via `--aui-glow-opacity`. */
  opacity?: number
  /**
   * If `true`, instead of the autonomous loop the gradient points toward the
   * cursor, interpolated with momentum (WAAPI). Default: `false`.
   */
  followCursor?: boolean
  /**
   * If `false`, the autonomous loop runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the loop stops
   * and the gradient remains static; `followCursor` stays active since it responds
   * to direct user input).
   */
  respectReducedMotion?: boolean
  /** Classes for the inner content container (where your background goes). */
  contentClassName?: string
  /** Inline styles for the inner content container. */
  contentStyle?: CSSProperties
  className?: string
  style?: CSSProperties
}
