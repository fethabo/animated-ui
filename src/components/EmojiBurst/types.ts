import type { HTMLAttributes } from 'react'

/** Burst origin, relative to the container: `0–1` per axis (`{x:0.5, y:0.5}` = center). */
export interface EmojiOrigin {
  x: number
  y: number
}

/**
 * Options for a single `fire(options?)` shot. Each field overrides the
 * component prop of the same name **for that burst only** — the props remain
 * the defaults for subsequent shots.
 */
export interface EmojiFireOptions {
  /** List each particle picks its emoji from at random. */
  emojis?: string[]
  /** Number of emojis in the burst. */
  count?: number
  /** Base font size in px. */
  size?: number
  /** Burst origin, relative to the container (`0–1` per axis). */
  origin?: EmojiOrigin
  /** Central direction of the fan in degrees; `90` = upward. */
  angle?: number
  /** Total cone spread in degrees. */
  spread?: number
  /** Initial velocity in px/frame (burst strength). */
  power?: number
  /** Gravity in px/frame² (how much and how fast the emojis fall). */
  gravity?: number
}

/**
 * Imperative handle exposed by `EmojiBurst` via ref: type your
 * `useRef<EmojiBurstHandle>(null)` with this and fire with
 * `ref.current?.fire()`.
 */
export interface EmojiBurstHandle {
  /**
   * Fires a burst of emojis. The `options` override the component props for
   * this burst. Successive shots accumulate on the same canvas. No-op
   * before hydration and under `prefers-reduced-motion` (with
   * `respectReducedMotion` enabled).
   */
  fire(options?: EmojiFireOptions): void
}

export interface EmojiBurstProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Default list each particle picks its emoji from at random. Default:
   * `['🎉', '✨', '❤️']`. Rendered with the platform's emoji font
   * (`fillText`, no assets): the look varies across operating systems.
   */
  emojis?: string[]
  /**
   * Emojis per burst. Default: `30` — deliberately conservative: `fillText`
   * per particle is more expensive than the confetti shapes.
   */
  count?: number
  /** Base font size in px (each emoji jitters around it). Default: `24`. */
  size?: number
  /** Default burst origin, relative to the container (`0–1`). Default: `{x: 0.5, y: 0.5}`. */
  origin?: EmojiOrigin
  /** Central direction of the fan in degrees; `90` = upward. Default: `90`. */
  angle?: number
  /** Total cone spread in degrees. Default: `70`. */
  spread?: number
  /** Initial velocity in px/frame. Default: `11`. */
  power?: number
  /** Gravity in px/frame². Default: `0.25`. */
  gravity?: number
  /**
   * If `false`, `fire()` animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with the preference
   * active, `fire()` is a no-op: the burst is a self-contained celebration
   * with no useful static version — alternative feedback is up to the
   * consumer).
   */
  respectReducedMotion?: boolean
}
