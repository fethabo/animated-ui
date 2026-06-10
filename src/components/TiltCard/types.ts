import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

/** Estado de animación expuesto via render prop. */
export interface TiltState {
  /** Rotación actual sobre el eje X en grados (mouse arriba/abajo). */
  tiltX: number
  /** Rotación actual sobre el eje Y en grados (mouse izquierda/derecha). */
  tiltY: number
  /** `true` mientras el cursor está sobre el card. */
  isHovering: boolean
}

export interface TiltCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Ángulo máximo de rotación en grados, en cualquier eje. Default: `15`. */
  maxAngle?: number
  /**
   * Profundidad de perspectiva 3D en px. Default: `1000`.
   * También controlable via CSS: `--aui-tilt-perspective` pisa este valor.
   */
  perspective?: number
  /** Si es `true`, agrega un overlay de brillo especular que sigue el tilt invertido. Default: `false`. */
  glare?: boolean
  /**
   * Si es `false`, el tilt corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, tiltX/tiltY
   * quedan en 0 pero `isHovering` sigue funcionando).
   */
  respectReducedMotion?: boolean
  /** Contenido del card: nodos React o función `(state: TiltState) => ReactNode`. */
  children?: ReactNode | ((state: TiltState) => ReactNode)
  className?: string
  style?: CSSProperties
}
