import type { HTMLAttributes } from 'react'

/** Center of the scatter, relative to the container: `0–1` per axis (`{x:0.5, y:0.5}` = center). */
export interface SparkleOrigin {
  x: number
  y: number
}

/**
 * Options for a single `fire(options?)` shot. Each field overrides the
 * component prop of the same name **for that burst only** — the props remain
 * the defaults for subsequent shots.
 */
export interface SparkleFireOptions {
  /** Number of sparkles in the burst. */
  count?: number
  /** Burst palette: each sparkle picks its color at random from here. */
  colors?: string[]
  /** Center of the scatter, relative to the container (`0–1` per axis). */
  origin?: SparkleOrigin
  /** Scatter radius around the origin, in px. */
  spread?: number
  /** Maximum outer radius of each star, in px. */
  size?: number
  /** Total lifetime of the burst in seconds. */
  duration?: number
}

/**
 * Imperative handle exposed by `SparkleBurst` via ref: type your
 * `useRef<SparkleBurstHandle>(null)` with this and fire with
 * `ref.current?.fire()`.
 */
export interface SparkleBurstHandle {
  /**
   * Fires a burst of sparkles. The `options` override the component props
   * for this burst. Successive shots accumulate on the same canvas. No-op
   * before hydration and under `prefers-reduced-motion` (with
   * `respectReducedMotion` enabled).
   */
  fire(options?: SparkleFireOptions): void
}

export interface SparkleBurstProps extends HTMLAttributes<HTMLDivElement> {
  /** Sparkles per burst. Default: `8`. */
  count?: number
  /**
   * Default palette: each sparkle picks its color at random from here.
   * Default: golds and white. Also via `--aui-sparkle-color-<i>`.
   */
  colors?: string[]
  /** Default center of the scatter, relative to the container (`0–1`). Default: `{x: 0.5, y: 0.5}`. */
  origin?: SparkleOrigin
  /** Scatter radius around the origin, in px. Default: `60`. */
  spread?: number
  /** Maximum outer radius of each star, in px. Default: `12`. */
  size?: number
  /** Total lifetime of each burst in seconds. Default: `0.9`. */
  duration?: number
  /**
   * If `false`, `fire()` animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with the preference
   * active, `fire()` is a no-op: the sparkle is a self-contained celebration
   * with no useful static version — alternative feedback is up to the
   * consumer).
   */
  respectReducedMotion?: boolean
}
