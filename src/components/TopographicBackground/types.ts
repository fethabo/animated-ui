import type { HTMLAttributes } from 'react'

export interface TopographicBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Cantidad de niveles de contorno distribuidos por el rango del campo. Default: `10`. */
  levels?: number
  /** Color de las curvas de nivel. Default: `'#38bdf8'`. También via `--aui-topo-color`. */
  color?: string
  /** Grosor de las curvas en px. Default: `1`. También via `--aui-topo-line-width`. */
  lineWidth?: number
  /**
   * Zoom del terreno en px: a mayor `scale`, relieves más amplios y curvas
   * más espaciadas. Default: `220`.
   */
  scale?: number
  /**
   * Velocidad de la evolución temporal del terreno (deformación gradual).
   * `0` = terreno fijo, sin RAF corriendo. Default: `1` (lento).
   */
  speed?: number
  /**
   * Semilla del campo: la misma `seed` + dimensiones producen el mismo mapa
   * (sin `Math.random`). Default: `'aui'`.
   */
  seed?: string | number
  /**
   * Si es `false`, la evolución corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, el mapa se dibuja
   * una vez, estático).
   */
  respectReducedMotion?: boolean
}
