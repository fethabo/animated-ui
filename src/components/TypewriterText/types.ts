import type { HTMLAttributes } from 'react'

export interface TypewriterTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Texto a escribir. Un string se escribe una sola vez; un `string[]` con
   * `loop` activo cicla escribiendo → pausando → borrando → siguiente. Es
   * texto plano (no `children`): el motor opera carácter por carácter.
   */
  text: string | string[]
  /** Caracteres escritos por segundo. Default: `30`. */
  speed?: number
  /** Milisegundos antes de comenzar a escribir. Default: `0`. */
  startDelay?: number
  /**
   * Cursor al final del texto. `true` usa un glifo default (`|`); un string
   * usa ese carácter como glifo (e.g. `"_"`, `"▋"`); `false` lo desactiva.
   * Parpadea via animación CSS (sin JS por frame). Default: `true`.
   */
  cursor?: boolean | string
  /** Caracteres borrados por segundo en modo loop. Default: `30`. */
  deleteSpeed?: number
  /** Milisegundos de pausa con el string completo antes de borrar. Default: `1500`. */
  pauseDuration?: number
  /**
   * Si es `true` y `text` es un arreglo, cicla indefinidamente entre los
   * strings (escribe→pausa→borra→siguiente). Default: `false`.
   */
  loop?: boolean
  /**
   * Si es `false`, la escritura anima aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce se muestra el texto
   * final completo de inmediato, sin escritura ni parpadeo del cursor).
   */
  respectReducedMotion?: boolean
}
