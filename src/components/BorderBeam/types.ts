import type { HTMLAttributes } from 'react'

export interface BorderBeamProps extends HTMLAttributes<HTMLDivElement> {
  /** Color de la cabeza del cometa. Default: `'#7c3aed'`. También via `--aui-beam-color-from`. */
  colorFrom?: string
  /** Color de la cola del degradé. Default: `'#0ea5e9'`. También via `--aui-beam-color-to`. */
  colorTo?: string
  /** Largo del cometa en px. Default: `96`. También via `--aui-beam-size`. */
  size?: number
  /** Segundos por vuelta completa al perímetro. Default: `6`. También via `--aui-beam-duration`. */
  duration?: number
  /**
   * Desfase inicial del recorrido en segundos (negativo arranca "ya avanzado").
   * Útil para desincronizar múltiples instancias. Default: `0`.
   */
  delay?: number
  /** Grosor del trazo del cometa (y del realce estático) en px. Default: `2`. También via `--aui-beam-border-width`. */
  borderWidth?: number
  /**
   * Si es `false`, el cometa recorre el borde aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, realce de borde
   * estático sutil, sin movimiento).
   */
  respectReducedMotion?: boolean
}
