import type { HTMLAttributes, ReactNode } from 'react'
import type { TargetLike } from '../../utils/idle-target'
import type { AestheticName } from './aesthetics'

export type { AestheticName } from './aesthetics'

export interface GuidingBranchesProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Optional. Element to bias the branches toward: `RefObject`, `Element` or
   * CSS selector. The primary use is **ambient** (no `target`): branches
   * expand 360° around the pointer up to the boundary. With `target`, the
   * dominant branch is biased toward it (directed mode).
   */
  target?: TargetLike
  /** Stroke aesthetic: `'roots'` (organic), `'lightning'` (bolt) or `'circuit'` (orthogonal). Default: `'roots'`. */
  aesthetic?: AestheticName
  /** Ms of pointer inactivity before growing the branches. Default: `2000`. */
  idleDelay?: number
  /** Color of the branches. Default: `'#34d399'`. Also via `--aui-branches-color`. */
  color?: string
  /**
   * If `true`, the stroke re-grows in a loop: once complete it waits
   * `duration` ms and grows again. If `false` (default), it grows once and
   * **stays static** until the pointer moves (no loop).
   */
  loop?: boolean
  /** Ms the branches stay complete before re-growing, when `loop`. Default: `1400`. Also via `--aui-branches-duration`. */
  duration?: number
  /** Drawing speed of the growth in px/second. Default: `320`. Also via `--aui-branches-speed`. */
  speed?: number
  /** Maximum distance in px any branch can reach from the pointer. Default: `260`. Also via `--aui-branches-max-distance`. */
  maxDistance?: number
  /** Branching density (number of trunks / probability of children). Default: `4`. */
  density?: number
  /** Maximum sub-branching depth. Default: `3`. */
  depth?: number
  /** Stroke width in px. Default: `2`. Also via `--aui-branches-line-width`. */
  lineWidth?: number
  /**
   * Curvature of the stroke (0 = nearly straight, 1 = very sinuous). Raise
   * this so `roots` looks like organic roots instead of bolts. Default: `0.6`.
   * Also via `--aui-branches-curl`. (Orthogonal aesthetics ignore it.)
   */
  curl?: number
  /** Stroke jitter for lightning-like aesthetics in px. Default: `0` (auto). Also via `--aui-branches-jitter`. */
  jitter?: number
  /**
   * If `true` (default), with `prefers-reduced-motion` the branches (an
   * autonomous timer-driven effect) are NOT drawn.
   */
  respectReducedMotion?: boolean
  /** Monitored/overlaid content (the overlay does not intercept its clicks). */
  children?: ReactNode
}
