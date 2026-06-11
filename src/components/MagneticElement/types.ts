import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

/** Estado de animación expuesto via render prop. */
export interface MagneticState {
  /** Desplazamiento horizontal actual del contenido en px. */
  offsetX: number
  /** Desplazamiento vertical actual del contenido en px. */
  offsetY: number
  /** `true` mientras el cursor está dentro de la zona de atracción. */
  isActive: boolean
}

export interface MagneticElementProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Intensidad de la atracción (0 a 1): cuánto se desplaza el contenido hacia el cursor. Default: `0.35`. */
  strength?: number
  /**
   * Padding transparente en px que agranda la zona de atracción alrededor
   * del contenido. Participa del layout del wrapper; con `0` el wrapper
   * colapsa al tamaño del contenido. Default: `40`.
   */
  hitArea?: number
  /**
   * Si es `false`, la atracción corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, el contenido no
   * se mueve: offsets quedan en 0 pero `isActive` sigue reportándose).
   */
  respectReducedMotion?: boolean
  /** Contenido a magnetizar: nodos React o función `(state: MagneticState) => ReactNode`. */
  children?: ReactNode | ((state: MagneticState) => ReactNode)
  className?: string
  style?: CSSProperties
}
