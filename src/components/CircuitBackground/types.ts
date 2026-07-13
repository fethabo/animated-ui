import type { HTMLAttributes } from 'react'

export interface CircuitBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Layout seed: the same `seed` + size + `density` always produce
   * the same circuit (deterministic, stable across SSR↔hydration). Default: `'aui'`.
   */
  seed?: string | number
  /**
   * Track density: number of paths per area (scales with size).
   * Higher values ⇒ more tracks. Default: `1`.
   */
  density?: number
  /** Color of the tracks and pads (any CSS color). Default: `'#1e3a5f'`. Also via `--aui-circuit-track-color`. */
  trackColor?: string
  /** Color of the light pulses traveling along the tracks. Default: `'#22d3ee'`. Also via `--aui-circuit-pulse-color`. */
  pulseColor?: string
  /** Pulse speed in px/second. Default: `90`. Also via `--aui-circuit-pulse-speed`. */
  pulseSpeed?: number
  /** Number of pulses traveling simultaneously. Default: `8`. */
  pulseCount?: number
  /** Track thickness in px. Default: `2`. Also via `--aui-circuit-line-width`. */
  lineWidth?: number
  /**
   * If `true` (default), under `prefers-reduced-motion` the tracks are drawn
   * static but the pulses do not animate (loop stopped).
   */
  respectReducedMotion?: boolean
}
