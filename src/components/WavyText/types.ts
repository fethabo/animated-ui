import type { ElementType, HTMLAttributes } from 'react'

export interface WavyTextProps extends HTMLAttributes<HTMLElement> {
  /** El texto a ondular (texto plano; se parte por carácter). */
  children: string
  /** Elemento root a renderizar. Default: `'span'`. */
  as?: ElementType
  /** Desplazamiento vertical máximo en px. Default: `6`. También via `--aui-wavy-amplitude`. */
  amplitude?: number
  /** Duración de un ciclo de ola en segundos. Default: `1.6`. También via `--aui-wavy-speed`. */
  speed?: number
  /** Desfase entre caracteres consecutivos en segundos. Default: `0.06`. También via `--aui-wavy-stagger`. */
  stagger?: number
  /**
   * Si es `false`, la ondulación opera aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, texto estático en
   * su línea base).
   */
  respectReducedMotion?: boolean
}
