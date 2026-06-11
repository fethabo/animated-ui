import type { HTMLAttributes } from 'react'

export type ScrollProgressPosition = 'top' | 'bottom'

export interface ScrollProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Borde del viewport donde se fija la barra. Default: `'top'`. */
  position?: ScrollProgressPosition
  /** Color de la barra de progreso. Default: `#7c3aed`. También via `--aui-progress-color`. */
  color?: string
  /** Grosor de la barra en px. Default: `3`. También via `--aui-progress-height`. */
  height?: number
  /** Color del track (el fondo de la barra). Default: `transparent`. También via `--aui-progress-bg`. */
  trackColor?: string
  /** z-index del elemento fijo, por si compite con headers del consumer. Default: `50`. También via `--aui-progress-z`. */
  zIndex?: number
  /**
   * Aceptada por consistencia de API; la barra queda activa en ambos casos:
   * refleja 1:1 la posición de scroll que el usuario controla directamente
   * (como la scrollbar nativa) y no desplaza contenido. Default: `true`.
   */
  respectReducedMotion?: boolean
}
