import type { CSSProperties, HTMLAttributes } from 'react'

export type BehaviorName = 'hover' | 'idle' | 'reveal'

/** A grid cell, in CSS pixel coordinates. */
export interface PixelCell {
  col: number
  row: number
  /** Top-left corner of the cell. */
  x: number
  y: number
  centerX: number
  centerY: number
}

/** Context the renderer passes to each behavior on every frame. */
export interface PixelFrameContext {
  /** Seconds since the renderer started. */
  time: number
  /** Seconds since the previous frame. */
  delta: number
  /** Mouse position relative to the canvas, or `null` if outside. */
  mouse: { x: number; y: number } | null
  cols: number
  rows: number
  cellSize: number
  gap: number
}

/**
 * A behavior contributes a numeric value per cell per frame.
 * - `mode: 'brightness'`: contributions are ADDED to the base alpha (hover, idle).
 * - `mode: 'opacity'`: contributions (0..1) are MULTIPLIED onto the result (reveal).
 */
export interface PixelBehavior {
  name: BehaviorName
  mode: 'brightness' | 'opacity'
  /** Optional per-frame hook, before iterating the cells (e.g. easing internal state). */
  frame?(ctx: PixelFrameContext): void
  /** This cell's contribution for this frame. */
  cell(cell: PixelCell, ctx: PixelFrameContext): number
}

/**
 * Advanced per-cell theming callback.
 * @param x cell column
 * @param y cell row
 * @param proximity hover behavior contribution (0..1), 0 when not active
 * @param idlePhase idle behavior contribution (-intensity..+intensity), 0 when not active
 * @returns any valid CSS color for `fillStyle`
 */
export type CellColorFn = (x: number, y: number, proximity: number, idlePhase: number) => string

export interface PixelBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Side in px of each square cell. Default: `12`. */
  cellSize?: number
  /** Space in px between cells. Default: `2`. */
  gap?: number
  /** Active behaviors, combinable. Default: `['hover']`. */
  behaviors?: BehaviorName[]
  /** Static color for all cells. Default: `'#7c3aed'`. */
  color?: string
  /** Dynamic per-cell color; takes precedence over `color`. */
  cellColor?: CellColorFn
  /** Base alpha of cells with no behavior contribution (0..1). Default: `0.15`. */
  baseOpacity?: number
  /** Influence radius in px of the hover behavior. Default: `120`. */
  hoverRadius?: number
  /** Flicker amplitude of the idle behavior (0..1). Default: `1`. */
  idleIntensity?: number
  /** Idle flicker speed (approx. cycles per second). Default: `1.5`. */
  idleSpeed?: number
  /** Duration in ms of the dithered reveal. Default: `1200`. */
  revealDuration?: number
  /**
   * If `true` (default), the `idle` and `reveal` behaviors are disabled
   * under `prefers-reduced-motion`. `hover` stays active: it is a direct
   * response to user input.
   */
  respectReducedMotion?: boolean
  className?: string
  style?: CSSProperties
}
