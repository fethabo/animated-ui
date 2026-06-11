import type { HTMLAttributes } from 'react'

export interface MouseParallaxProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Segundos del suavizado con que las capas siguen al mouse. Default: `0.2`.
   * También via `--aui-parallax-ease`.
   */
  ease?: number
  /**
   * Si es `false`, el parallax corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, las capas quedan
   * estáticas: el efecto desplaza contenido real).
   */
  respectReducedMotion?: boolean
}

export interface MouseParallaxLayerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Desplazamiento máximo de la capa en px cuando el cursor está en el borde
   * del contenedor. Positivo sigue al mouse; negativo se opone (profundidad
   * invertida). Default: `20`. También via `--aui-parallax-depth`.
   */
  depth?: number
}
