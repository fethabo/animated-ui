import type { HTMLAttributes } from 'react'

export interface FlowFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of particles tracing the field. Default: `400`. */
  count?: number
  /** Particle advance speed in px/frame. Default: `1`. */
  speed?: number
  /**
   * Trail palette: each particle draws its color at random. Default:
   * `['#22d3ee', '#a78bfa', '#f472b6']`. Also via `--aui-flow-color-<i>`.
   */
  colors?: string[]
  /**
   * Trail persistence (`0–1`): how long it takes to fade out. Higher ⇒
   * trails remain visible for longer. Default: `0.95`.
   */
  fade?: number
  /**
   * Noise field zoom in px: the larger the `scale`, the wider and
   * smoother the curves. Default: `200`.
   */
  scale?: number
  /**
   * Background color the component paints (required for the trail fade:
   * the background is NOT transparent, unlike ParticleField).
   * Default: `'#0a0a12'`. Also via `--aui-flow-background`.
   */
  background?: string
  /**
   * Seed for the field and the positions/respawns: the same `seed` +
   * dimensions produce the same evolution (no `Math.random`). Default: `'aui'`.
   */
  seed?: string | number
  /**
   * If `false`, the simulation runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, a static
   * composition of pre-simulated trails is drawn, no RAF).
   */
  respectReducedMotion?: boolean
}
