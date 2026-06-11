import type { HTMLAttributes } from 'react'

export interface ShinyTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color base del texto. Default: `#71717a`. También via `--aui-shiny-color`. */
  color?: string
  /** Color de la franja de brillo que barre el texto. Default: `#fafafa`. También via `--aui-shiny-highlight`. */
  highlight?: string
  /** Segundos por barrido completo del loop. Default: `3`. También via `--aui-shiny-speed`. */
  speed?: number
  /** Ángulo del gradiente/barrido en grados. Default: `120`. También via `--aui-shiny-angle`. */
  angle?: number
  /**
   * Si es `false`, el barrido corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, el loop se detiene
   * y queda el gradiente estático).
   */
  respectReducedMotion?: boolean
}
