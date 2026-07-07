import type { HTMLAttributes } from 'react'

/** Dirección del desplazamiento; `up`/`down` para cintas verticales (columnas). */
export type MarqueeDirection = 'left' | 'right' | 'up' | 'down'

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  /** Dirección del desplazamiento. Default: `'left'`. */
  direction?: MarqueeDirection
  /** Velocidad de la cinta en px/s. Default: `60`. */
  speed?: number
  /**
   * Pausa la animación mientras el cursor está sobre la cinta y la reanuda al
   * salir, sin salto. Default: `false`.
   */
  pauseOnHover?: boolean
  /**
   * Modo opt-in: la velocidad de la cinta y un skew sutil responden a la
   * velocidad de scroll de la página (via el scroll-driver del paquete).
   * Sin esta prop el componente no se suscribe al scroll. Default: `false`.
   */
  scrollVelocity?: boolean
  /** Separación entre ítems y repeticiones en px. Default: `24`. También via `--aui-marquee-gap`. */
  gap?: number
  /** Desvanece los extremos de la cinta con una máscara de gradiente. Default: `false`. */
  fadeEdges?: boolean
  /**
   * Si es `false`, la cinta se desplaza aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, contenido estático
   * en una sola pasada, sin duplicados).
   */
  respectReducedMotion?: boolean
}
