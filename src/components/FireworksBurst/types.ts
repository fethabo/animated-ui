import type { HTMLAttributes } from 'react'

/** Launch base, relative to the container: `0–1` per axis (`{x:0.5, y:1}` = bottom center). */
export interface FireworksOrigin {
  x: number
  y: number
}

/**
 * Options for a single `fire(options?)` shot. Each field overrides the
 * component prop of the same name **for that burst only** — the props remain
 * the defaults for subsequent shots.
 */
export interface FireworksFireOptions {
  /** Rockets in the burst (with staggered liftoff). */
  rockets?: number
  /** Sparks per explosion. */
  particleCount?: number
  /** Burst palette: each rocket picks its explosion color at random from here. */
  colors?: string[]
  /** Launch base, relative to the container (`0–1` per axis). */
  origin?: FireworksOrigin
  /** Ascent impulse in px/frame (also defines the apex height). */
  power?: number
  /** Gravity in px/frame² (slows the ascent and makes the sparks fall). */
  gravity?: number
}

/**
 * Imperative handle exposed by `FireworksBurst` via ref: type your
 * `useRef<FireworksBurstHandle>(null)` with this and fire with
 * `ref.current?.fire()`.
 */
export interface FireworksBurstHandle {
  /**
   * Fires a round of fireworks. The `options` override the component props
   * for this burst. Successive shots accumulate on the same canvas. No-op
   * before hydration and under `prefers-reduced-motion` (with
   * `respectReducedMotion` enabled).
   */
  fire(options?: FireworksFireOptions): void
}

export interface FireworksBurstProps extends HTMLAttributes<HTMLDivElement> {
  /** Rockets per burst. Default: `1`. */
  rockets?: number
  /** Sparks per explosion. Default: `60`. */
  particleCount?: number
  /**
   * Default palette: each rocket picks its explosion color at random from here.
   * Default: festive 5-color palette. Also via `--aui-fireworks-color-<i>`.
   */
  colors?: string[]
  /** Default launch base, relative to the container (`0–1`). Default: `{x: 0.5, y: 1}`. */
  origin?: FireworksOrigin
  /** Ascent impulse in px/frame. Default: `13`. */
  power?: number
  /** Gravity in px/frame². Default: `0.18`. */
  gravity?: number
  /**
   * If `false`, `fire()` animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with the preference
   * active, `fire()` is a no-op: fireworks are a self-contained celebration
   * with no useful static version — alternative feedback is up to the
   * consumer).
   */
  respectReducedMotion?: boolean
}
