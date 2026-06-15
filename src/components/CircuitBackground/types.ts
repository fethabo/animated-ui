import type { HTMLAttributes } from 'react'

export interface CircuitBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Semilla del trazado: la misma `seed` + tamaño + `density` producen siempre
   * el mismo circuito (determinista, estable SSR↔hidratación). Default: `'aui'`.
   */
  seed?: string | number
  /**
   * Densidad de pistas: cantidad de caminos por área (escala con el tamaño).
   * Valores mayores ⇒ más pistas. Default: `1`.
   */
  density?: number
  /** Color de las pistas y pads (cualquier color CSS). Default: `'#1e3a5f'`. También via `--aui-circuit-track-color`. */
  trackColor?: string
  /** Color de los pulsos de luz que recorren las pistas. Default: `'#22d3ee'`. También via `--aui-circuit-pulse-color`. */
  pulseColor?: string
  /** Velocidad de los pulsos en px/segundo. Default: `90`. También via `--aui-circuit-pulse-speed`. */
  pulseSpeed?: number
  /** Cantidad de pulsos viajando simultáneamente. Default: `8`. */
  pulseCount?: number
  /** Grosor de las pistas en px. Default: `2`. También via `--aui-circuit-line-width`. */
  lineWidth?: number
  /**
   * Si es `true` (default), con `prefers-reduced-motion` las pistas se dibujan
   * estáticas pero los pulsos no se animan (loop detenido).
   */
  respectReducedMotion?: boolean
}
