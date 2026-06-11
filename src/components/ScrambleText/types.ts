import type { HTMLAttributes } from 'react'

export type ScrambleTrigger = 'mount' | 'hover' | 'both'

export interface ScrambleTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Texto final a revelar. Es un string plano (no `children`): el scrambler
   * opera carácter por carácter y no puede scramblear elementos.
   */
  text: string
  /** Caracteres revelados por segundo. Default: `25`. */
  speed?: number
  /** Pool de caracteres aleatorios mostrados durante el scramble. */
  charset?: string
  /**
   * Qué dispara el scramble. `'mount'` anima al montar y al cambiar `text`;
   * `'hover'` re-anima en cada `mouseenter`; `'both'` combina ambos.
   * Default: `'mount'`.
   */
  trigger?: ScrambleTrigger
  /**
   * Color de los caracteres mientras dura el scramble. Default:
   * `currentColor`. También via `--aui-scramble-color`.
   */
  scrambleColor?: string
  /**
   * Si es `false`, el reveal autónomo (mount, cambio de `text`) corre aunque
   * el sistema tenga activado `prefers-reduced-motion`. Default: `true`
   * (con reduce se muestra el texto final directo; el trigger `hover` sigue
   * activo por responder a input directo del usuario).
   */
  respectReducedMotion?: boolean
}
