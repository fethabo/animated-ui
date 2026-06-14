import type { HTMLAttributes, ReactNode } from 'react'

export interface StackedCardsProps extends HTMLAttributes<HTMLDivElement> {
  /** Cards: cada hijo directo se envuelve en un wrapper sticky. */
  children?: ReactNode
  /** Píxeles desde el top del viewport donde se fija el stack. Default: `0`. También via `--aui-stack-offset`. */
  offsetTop?: number
  /** Cuánto se encoge cada card por nivel de profundidad (0–1). Default: `0.05`. También via `--aui-stack-scale-step`. */
  scaleStep?: number
  /** Cuánto se oscurece cada card por nivel de profundidad (0–1). Default: `0` (sin oscurecer). También via `--aui-stack-opacity-step`. */
  opacityStep?: number
  /** Píxeles de scroll dedicados a cada card (define el recorrido y la altura de cada wrapper). Default: `400`. También via `--aui-stack-travel`. */
  cardTravel?: number
  /**
   * Si es `false`, el encogido/oscurecido ligado al scroll corre aunque el
   * sistema tenga activado `prefers-reduced-motion`. Default: `true` (con
   * reduce las cards quedan en un layout sticky estático y legible, sin las
   * transformaciones ligadas al scroll).
   */
  respectReducedMotion?: boolean
}
