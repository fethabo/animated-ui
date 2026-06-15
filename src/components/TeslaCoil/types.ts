import type { HTMLAttributes, ReactNode } from 'react'

/** Posición del nodo central, como fracción del contenedor (0..1 en cada eje). */
export interface CoilOrigin {
  x: number
  y: number
}

export interface TeslaCoilProps extends HTMLAttributes<HTMLDivElement> {
  /** Color de los rayos y el glow (cualquier color CSS). Default: `'#7dd3fc'`. También via `--aui-tesla-color`. */
  color?: string
  /** Cantidad de rayos ambientales emitidos desde el centro. Default: `7`. */
  boltCount?: number
  /** Grosor de los rayos en px. Default: `2`. También via `--aui-tesla-line-width`. */
  lineWidth?: number
  /**
   * Frecuencia de regeneración de los rayos ambientales en veces por segundo.
   * Default: `12`. También via `--aui-tesla-frequency`.
   */
  frequency?: number
  /** Alcance/longitud máxima de los rayos en px. Default: `160`. También via `--aui-tesla-reach`. */
  reach?: number
  /** Magnitud de la desviación jagged del trazo en px. Default: `18`. También via `--aui-tesla-jitter`. */
  jitter?: number
  /**
   * Dirige rayos extra hacia el cursor cuando está sobre el contenedor.
   * Default: `true`. En touch (sin hover) se ignora.
   */
  followCursor?: boolean
  /**
   * Cantidad de rayos dirigidos al cursor. Se dibujan más gruesos y brillantes
   * (con núcleo blanco) que los ambientales. Default: `3`.
   */
  cursorBolts?: number
  /**
   * Cuándo salen los rayos dirigidos al cursor: `'hover'` (mientras el cursor
   * está encima, default) o `'click'` (solo mientras se mantiene presionado).
   */
  cursorTrigger?: 'hover' | 'click'
  /** Posición del nodo central como fracción del contenedor. Default: `{ x: 0.5, y: 0.5 }`. */
  origin?: CoilOrigin
  /**
   * Si es `true` (default), con `prefers-reduced-motion` los rayos ambientales
   * no se regeneran (cuadro estático). El seguimiento del cursor MAY seguir activo.
   */
  respectReducedMotion?: boolean
  /** Contenido superpuesto al efecto (el canvas no intercepta sus eventos). */
  children?: ReactNode
}
