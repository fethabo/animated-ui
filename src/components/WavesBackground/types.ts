import type { HTMLAttributes } from 'react'

export interface WavesBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Cantidad de líneas distribuidas verticalmente. Default: `24`. */
  lines?: number
  /** Amplitud de la ondulación en px. Default: `24`. */
  amplitude?: number
  /**
   * Velocidad de la deriva temporal del campo (factor adimensional; `0`
   * congela la ondulación). Default: `1`.
   */
  speed?: number
  /**
   * Paleta de las líneas: con más de un color, cada línea interpola su color
   * según su posición vertical entre los extremos de la paleta. Default:
   * `['#22d3ee', '#a78bfa']`. También via `--aui-waves-color-<i>`.
   */
  colors?: string[]
  /** Grosor de las líneas en px. Default: `1.5`. También via `--aui-waves-line-width`. */
  lineWidth?: number
  /**
   * Semilla del campo de ruido: la misma `seed` + dimensiones producen
   * siempre las mismas ondas (sin `Math.random`). Default: `'aui'`.
   */
  seed?: string | number
  /**
   * Si es `false`, la animación corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, las líneas se
   * dibujan curvadas pero inmóviles, sin RAF).
   */
  respectReducedMotion?: boolean
}
