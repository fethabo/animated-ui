import type { CSSProperties, HTMLAttributes } from 'react'

export interface GlowBorderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Colores del gradiente cónico (hasta 3); los no provistos caen al default.
   * También via `--aui-glow-color-1..3`.
   */
  colors?: string[]
  /** Segundos por rotación completa del loop. Default: `4`. También via `--aui-glow-speed`. */
  speed?: number
  /** Ancho del anillo de borde en px. Default: `1`. También via `--aui-glow-width`. */
  width?: number
  /** Border-radius exterior en px (el interior se calcula solo). Default: `12`. También via `--aui-glow-radius`. */
  radius?: number
  /** Intensidad/opacidad del glow (0 a 1). Default: `1`. También via `--aui-glow-opacity`. */
  opacity?: number
  /**
   * Si es `true`, en lugar del loop autónomo el gradiente apunta hacia el
   * cursor, interpolado con momentum (WAAPI). Default: `false`.
   */
  followCursor?: boolean
  /**
   * Si es `false`, el loop autónomo corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, el loop se detiene
   * y queda el gradiente estático; `followCursor` sigue activo por responder
   * a input directo del usuario).
   */
  respectReducedMotion?: boolean
  /** Clases para el contenedor interno de contenido (donde va tu background). */
  contentClassName?: string
  /** Estilos inline para el contenedor interno de contenido. */
  contentStyle?: CSSProperties
  className?: string
  style?: CSSProperties
}
