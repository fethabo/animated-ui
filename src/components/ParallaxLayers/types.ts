import type { HTMLAttributes } from 'react'

export interface ParallaxLayersProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Si es `false`, el parallax corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, las capas quedan
   * en su posición de layout: el efecto crea movimiento relativo durante el
   * scroll, el más sensible para usuarios con sensibilidad vestibular).
   */
  respectReducedMotion?: boolean
}

export interface ParallaxLayersLayerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Desplazamiento máximo de la capa en px a lo largo del recorrido del
   * contenedor por el viewport. Positivo se mueve con el scroll (más lento
   * que el contenido: sensación de fondo); negativo contra él. Default: `40`.
   * También via `--aui-parallax-scroll-depth`.
   */
  depth?: number
}
