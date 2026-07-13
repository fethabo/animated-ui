import type { HTMLAttributes } from 'react'

/** How particles react to the cursor within the influence radius. */
export type CursorInteraction = 'repel' | 'attract' | 'none'

/**
 * Drift mode of the particle motion.
 * - `'bounce'` (default): random velocity + bounce off edges (original behavior).
 * - `'snow'`: fall downward with gentle horizontal drift; wrap at the top.
 * - `'embers'`: rise while fading out over their lifetime; re-enter from the bottom.
 * - `'bubbles'`: rise with sinusoidal lateral wobble; wrap at the bottom.
 * - `'warp'`: spawn at a top-center point and accelerate radially outward
 *   (down and to the sides), like a starfield / space travel effect;
 *   on leaving the area they re-enter near the origin point.
 */
export type DriftMode = 'bounce' | 'snow' | 'embers' | 'bubbles' | 'warp'

export interface ParticleFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of particles in the field. Default: `60`. */
  count?: number
  /**
   * Initial speed factor: range of each particle's random velocity in
   * px/frame. Default: `0.4`.
   */
  speed?: number
  /** Radius of each particle in px. Default: `2`. Also via `--aui-particle-radius`. */
  radius?: number
  /** Particle color (any CSS color). Default: `'#7c3aed'`. Also via `--aui-particle-color`. */
  color?: string
  /**
   * Reaction to the cursor within the influence radius. Default: `'repel'`.
   * `'none'` disables the interaction (particles only animate on their own).
   */
  cursorInteraction?: CursorInteraction
  /** Cursor influence radius in px. Default: `120`. */
  cursorRadius?: number
  /**
   * Drift mode of the motion. Default: `'bounce'` (original behavior).
   * Directional modes (`snow`/`embers`/`bubbles`) re-enter particles
   * through the opposite edge (wrap) instead of bouncing.
   */
  drift?: DriftMode
  /**
   * Draws connection lines between nearby particles (constellation effect).
   * Default: `false`. Introduces an **opt-in** O(N²) pairwise computation:
   * with `false` no pairwise loop runs and the cost stays O(N).
   */
  links?: boolean
  /** Maximum distance in px to connect two particles with a line. Default: `120`. Also via `--aui-particle-link-distance`. */
  linkDistance?: number
  /** Color of the connection lines. Default: derived from the particle `color` with reduced alpha. Also via `--aui-particle-link-color`. */
  linkColor?: string
  /** Width of the connection lines in px. Default: `1`. Also via `--aui-particle-link-width`. */
  linkWidth?: number
  /**
   * Also connect particles near the cursor with lines toward it.
   * Default: `true` (only applies when `links` is active and a cursor is present).
   */
  linkCursor?: boolean
  /**
   * If `false`, the animation runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the RAF
   * stops and the canvas shows the particles in their initial static state).
   */
  respectReducedMotion?: boolean
}
