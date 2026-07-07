import type { ElementType, HTMLAttributes } from 'react'

/** Cuándo glitchea: en loop autónomo o solo con el cursor encima. */
export type GlitchTrigger = 'loop' | 'hover'

export interface GlitchTextProps extends HTMLAttributes<HTMLElement> {
  /**
   * El texto a glitchear. Solo texto plano: las capas desplazadas se duplican
   * via `content: attr(data-text)` (pseudo-elementos), que no soporta markup.
   */
  children: string
  /** Elemento root a renderizar. Default: `'span'`. */
  as?: ElementType
  /** Modo de activación. Default: `'loop'` (ráfagas intermitentes autónomas). */
  trigger?: GlitchTrigger
  /** Colores de los dos canales desplazados `[antes, después]`. Default: rojo/cyan. También via `--aui-glitch-color-1/2`. */
  colors?: [string, string] | string[]
  /** Desplazamiento máximo de los canales en px. Default: `3`. También via `--aui-glitch-intensity`. */
  intensity?: number
  /** Ráfagas de glitch por ciclo (el ciclo dura ~3s). Default: `1`. */
  frequency?: number
  /** Duración de cada ráfaga en segundos. Default: `0.3`. */
  burstDuration?: number
  /**
   * Si es `false`, el glitch opera aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, `loop` queda
   * estático; `hover` conserva un split estático atenuado, sin jitter).
   */
  respectReducedMotion?: boolean
}
