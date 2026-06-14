import type { HTMLAttributes } from 'react'

export type SplitMode = 'char' | 'word' | 'line'
export type SplitPreset = 'fade' | 'slide-up' | 'blur'
export type SplitTrigger = 'mount' | 'in-view'

export interface SplitRevealProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Texto a revelar. Es un string plano (no `children`): el componente lo
   * parte en unidades. Para SEO/SSR se renderiza completo desde el primer
   * paint y se parte tras la hidratación.
   */
  text: string
  /** Unidad de partición. Default: `'word'`. */
  split?: SplitMode
  /** Animación de entrada de cada unidad. Default: `'slide-up'`. */
  preset?: SplitPreset
  /**
   * Qué dispara el revelado: `'in-view'` al entrar al viewport (vía
   * IntersectionObserver), `'mount'` al montar. Default: `'in-view'`.
   */
  trigger?: SplitTrigger
  /** Segundos de delay incremental entre unidades. Default: `0.05`. También via `--aui-split-stagger`. */
  stagger?: number
  /** Duración de la transición de cada unidad, en segundos. Default: `0.6`. También via `--aui-split-duration`. */
  duration?: number
  /** Desplazamiento inicial en px para `slide-up`. Default: `16`. También via `--aui-split-distance`. */
  distance?: number
  /** Fracción visible que dispara el revelado con `trigger='in-view'`. Default: `0.15`. */
  threshold?: number
  /**
   * Si es `true` (default), el contenido queda revelado tras el primer
   * disparo. Con `false`, se re-oculta al salir del viewport y re-revela al
   * re-entrar (solo con `trigger='in-view'`).
   */
  once?: boolean
  /**
   * Si es `false`, el revelado anima aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, el texto completo
   * se muestra de inmediato, sin stagger ni animación).
   */
  respectReducedMotion?: boolean
}
