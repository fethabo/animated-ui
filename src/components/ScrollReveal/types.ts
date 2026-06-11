import type { HTMLAttributes } from 'react'

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none'

export interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Desde dónde entra el contenido: `'up'` aparece desde abajo moviéndose
   * hacia arriba, `'down'` desde arriba, `'left'` desde la derecha, `'right'`
   * desde la izquierda, `'none'` solo fade. Default: `'up'`.
   */
  direction?: RevealDirection
  /** Desplazamiento inicial en px. Default: `24`. También via `--aui-reveal-distance`. */
  distance?: number
  /** Duración de la transición en segundos. Default: `0.6`. También via `--aui-reveal-duration`. */
  duration?: number
  /** Segundos de delay incremental entre hijos directos. Default: `0.1`. También via `--aui-reveal-stagger`. */
  stagger?: number
  /** Fracción del componente que debe ser visible para disparar el reveal. Default: `0.15`. */
  threshold?: number
  /**
   * Si es `true` (default), el contenido queda visible tras el primer reveal.
   * Con `false`, vuelve a ocultarse al salir del viewport y re-revela al entrar.
   */
  once?: boolean
  /**
   * Si es `false`, el reveal anima aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, el contenido se
   * muestra directo en su posición final, sin transición).
   */
  respectReducedMotion?: boolean
}
