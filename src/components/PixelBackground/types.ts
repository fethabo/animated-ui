import type { CSSProperties, HTMLAttributes } from 'react'

export type BehaviorName = 'hover' | 'idle' | 'reveal'

/** Una celda de la grilla, en coordenadas de píxeles CSS. */
export interface PixelCell {
  col: number
  row: number
  /** Esquina superior izquierda de la celda. */
  x: number
  y: number
  centerX: number
  centerY: number
}

/** Contexto que el renderer pasa a cada behavior en cada frame. */
export interface PixelFrameContext {
  /** Segundos desde que arrancó el renderer. */
  time: number
  /** Segundos desde el frame anterior. */
  delta: number
  /** Posición del mouse relativa al canvas, o `null` si está afuera. */
  mouse: { x: number; y: number } | null
  cols: number
  rows: number
  cellSize: number
  gap: number
}

/**
 * Un behavior aporta una contribución numérica por celda por frame.
 * - `mode: 'brightness'`: las contribuciones se SUMAN al alpha base (hover, idle).
 * - `mode: 'opacity'`: las contribuciones (0..1) se MULTIPLICAN sobre el resultado (reveal).
 */
export interface PixelBehavior {
  name: BehaviorName
  mode: 'brightness' | 'opacity'
  /** Hook opcional por frame, antes de iterar las celdas (e.g. easing de estado interno). */
  frame?(ctx: PixelFrameContext): void
  /** Contribución de esta celda en este frame. */
  cell(cell: PixelCell, ctx: PixelFrameContext): number
}

/**
 * Callback de theming avanzado por celda.
 * @param x columna de la celda
 * @param y fila de la celda
 * @param proximity contribución del behavior hover (0..1), 0 si no está activo
 * @param idlePhase contribución del behavior idle (-intensity..+intensity), 0 si no está activo
 * @returns cualquier color CSS válido para `fillStyle`
 */
export type CellColorFn = (x: number, y: number, proximity: number, idlePhase: number) => string

export interface PixelBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Lado en px de cada celda cuadrada. Default: `12`. */
  cellSize?: number
  /** Espacio en px entre celdas. Default: `2`. */
  gap?: number
  /** Behaviors activos, combinables. Default: `['hover']`. */
  behaviors?: BehaviorName[]
  /** Color estático para todas las celdas. Default: `'#7c3aed'`. */
  color?: string
  /** Color dinámico por celda; tiene prioridad sobre `color`. */
  cellColor?: CellColorFn
  /** Alpha base de las celdas sin contribución de behaviors (0..1). Default: `0.15`. */
  baseOpacity?: number
  /** Radio en px de influencia del behavior hover. Default: `120`. */
  hoverRadius?: number
  /** Amplitud del parpadeo del behavior idle (0..1). Default: `1`. */
  idleIntensity?: number
  /** Velocidad del parpadeo idle (ciclos por segundo aprox). Default: `1.5`. */
  idleSpeed?: number
  /** Duración en ms del reveal dithered. Default: `1200`. */
  revealDuration?: number
  /**
   * Si es `true` (default), con `prefers-reduced-motion` se desactivan los
   * behaviors `idle` y `reveal`. `hover` sigue activo: es respuesta directa
   * a input del usuario.
   */
  respectReducedMotion?: boolean
  className?: string
  style?: CSSProperties
}
