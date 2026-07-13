import type { HTMLAttributes } from 'react'

/** Shape of each confetti piece. */
export type ConfettiShape = 'rect' | 'circle'

/** Burst origin, relative to the container: `0–1` per axis (`{x:0.5, y:0.5}` = center). */
export interface ConfettiOrigin {
  x: number
  y: number
}

/**
 * Options for a single `fire(options?)` shot. Each field overrides the
 * component prop of the same name **for that burst only** — the props remain
 * the defaults for subsequent shots.
 */
export interface FireOptions {
  /** Number of pieces in the burst. */
  count?: number
  /** Burst palette: each piece picks its color at random from here. */
  colors?: string[]
  /** Shapes available for the pieces. */
  shapes?: ConfettiShape[]
  /** Burst origin, relative to the container (`0–1` per axis). */
  origin?: ConfettiOrigin
  /** Central direction of the fan in degrees; `90` = upward. */
  angle?: number
  /** Total cone spread in degrees. */
  spread?: number
  /** Initial velocity in px/frame (burst strength). */
  power?: number
  /** Gravity in px/frame² (how much and how fast the pieces fall). */
  gravity?: number
}

/**
 * Imperative handle exposed by `ConfettiBurst` via ref: type your
 * `useRef<ConfettiBurstHandle>(null)` with this and fire with
 * `ref.current?.fire()`.
 */
export interface ConfettiBurstHandle {
  /**
   * Fires a confetti burst. The `options` override the component props for
   * this burst. Successive shots accumulate on the same canvas. No-op
   * before hydration and under `prefers-reduced-motion` (with
   * `respectReducedMotion` enabled).
   */
  fire(options?: FireOptions): void
}

export interface ConfettiBurstProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of pieces per burst. Default: `80`. */
  count?: number
  /**
   * Default palette: each piece picks its color at random from here.
   * Default: festive 5-color palette. Also via `--aui-confetti-color-<i>`.
   */
  colors?: string[]
  /** Shapes available for the pieces. Default: `['rect', 'circle']`. */
  shapes?: ConfettiShape[]
  /** Default burst origin, relative to the container (`0–1`). Default: `{x: 0.5, y: 0.5}`. */
  origin?: ConfettiOrigin
  /** Central direction of the fan in degrees; `90` = upward. Default: `90`. */
  angle?: number
  /** Total cone spread in degrees. Default: `60`. */
  spread?: number
  /** Initial velocity in px/frame. Default: `12`. */
  power?: number
  /** Gravity in px/frame². Default: `0.25`. */
  gravity?: number
  /**
   * If `false`, `fire()` animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with the preference
   * active, `fire()` is a no-op: confetti is a self-contained celebration
   * with no useful static version — alternative feedback is up to the
   * consumer).
   */
  respectReducedMotion?: boolean
}
