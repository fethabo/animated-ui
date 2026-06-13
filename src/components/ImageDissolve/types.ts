import type { HTMLAttributes } from 'react'

export interface ImageDissolveProps extends HTMLAttributes<HTMLDivElement> {
  /** URL de la imagen a mostrar. Cambiarla dispara la transición dithered. */
  src: string
  /** Texto alternativo de la imagen (requerido por accesibilidad). */
  alt: string
  /** Duración de la transición en milisegundos. Default: `800`. */
  duration?: number
  /**
   * Si es `false`, la transición dithered corre aunque el sistema tenga
   * activado `prefers-reduced-motion`. Default: `true` (con reduce, el `src`
   * se swapea instantáneamente sin animar el canvas).
   */
  respectReducedMotion?: boolean
}
