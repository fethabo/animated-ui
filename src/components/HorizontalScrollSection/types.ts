import type { HTMLAttributes } from 'react'

export interface HorizontalScrollSectionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Multiplicador del recorrido vertical: cuánto scroll hace falta para
   * completar el desplazamiento horizontal (altura extra = recorrido
   * horizontal × `speed`). Más alto ⇒ desplazamiento más lento. Default: `1`.
   */
  speed?: number
  /**
   * Easing del mapeo scroll→desplazamiento: recibe el progreso lineal (`0–1`)
   * y retorna el progreso efectivo. Default: identidad (lineal).
   */
  easing?: (progress: number) => number
  /**
   * Si es `false`, el acople scroll→transform opera aunque el sistema tenga
   * activado `prefers-reduced-motion`. Default: `true` (con reduce, los
   * paneles se apilan verticalmente como secciones normales).
   */
  respectReducedMotion?: boolean
}
