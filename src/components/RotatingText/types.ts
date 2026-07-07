import type { HTMLAttributes, ReactNode } from 'react'

/** Preset de transición entre palabras. */
export type RotatingTransition = 'fade' | 'slide-up' | 'flip'

export interface RotatingTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** Lista de palabras por las que rota. */
  words: string[]
  /** Preset de la transición entre palabras. Default: `'slide-up'`. */
  transition?: RotatingTransition
  /** Ms que cada palabra permanece visible. Default: `2200`. */
  interval?: number
  /** Duración de la transición (entrada y ajuste de ancho) en segundos. Default: `0.4`. También via `--aui-rotating-duration`. */
  duration?: number
  /** Color de la palabra rotante. Default: hereda. También via `--aui-rotating-color`. */
  color?: string
  /** Con `false`, la rotación se detiene en la última palabra. Default: `true`. */
  loop?: boolean
  /**
   * Si es `false`, la rotación opera aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, muestra la primera
   * palabra estática).
   */
  respectReducedMotion?: boolean
  /** Texto base opcional que precede a la palabra rotante (e.g. `Hacemos `). */
  children?: ReactNode
}
