import type { HTMLAttributes, ReactNode } from 'react'
import type { TargetLike } from '../../utils/idle-target'

/** Style of the cue tip. */
export type CueHead = 'arrow' | 'dot' | 'none'

/** What draws the cue path: the light beam or a row of footprints. */
export type CueMarker = 'beam' | 'footprints'

export interface AttentionCueProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Element the cue points toward: a `RefObject`, an `Element` or a CSS
   * selector. With `target` ⇒ directed mode; without it ⇒ ambient mode.
   */
  target?: TargetLike
  /** Ms of pointer inactivity before drawing the cue. Default: `2000`. */
  idleDelay?: number
  /** Color of the cue stroke. Default: `'#fbbf24'`. Also via `--aui-cue-color`. */
  color?: string
  /** Duration in ms of the stroke drawing. Default: `700`. Also via `--aui-cue-duration`. */
  duration?: number
  /** Advance speed of the stroke in px/second. Default: `420`. Also via `--aui-cue-speed`. */
  speed?: number
  /** Maximum distance in px the cue can reach from the pointer. Default: `220`. Also via `--aui-cue-max-distance`. */
  maxDistance?: number
  /** Stroke width in px. Default: `3`. Also via `--aui-cue-line-width`. */
  lineWidth?: number
  /** Tip style: `'arrow'`, `'dot'` or `'none'`. Default: `'arrow'`. */
  head?: CueHead
  /**
   * What travels the path: `'beam'` (light beam, default) or `'footprints'`
   * (footprints advancing toward the destination, alternating left/right).
   */
  marker?: CueMarker
  /**
   * Curvature of the stroke (0 = straight, 1 = very curved). The stroke arcs
   * to one side instead of going straight. Default: `0`. Also via `--aui-cue-curve`.
   */
  curve?: number
  /**
   * If `true`, also draws a faint guide line under the flash. By default
   * (`false`) **only the light** is shown (the glowing comet), which appears
   * and fades like a flash, with no solid line.
   */
  showGuide?: boolean
  /**
   * If `true` (default), with `prefers-reduced-motion` the cue (an autonomous
   * timer-driven effect) is NOT drawn.
   */
  respectReducedMotion?: boolean
  /** Monitored/overlaid content (the overlay does not intercept its clicks). */
  children?: ReactNode
}
