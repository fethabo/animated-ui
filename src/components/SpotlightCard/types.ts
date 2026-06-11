import type { CSSProperties, HTMLAttributes } from 'react'

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Color del spotlight (cualquier color CSS; conviene usar alpha).
   * Default: `rgba(255, 255, 255, 0.15)`. También via `--aui-spotlight-color`.
   */
  color?: string
  /** Radio del spotlight en px. Default: `250`. También via `--aui-spotlight-radius`. */
  radius?: number
  /** Opacidad máxima del overlay al hacer hover (0 a 1). Default: `1`. También via `--aui-spotlight-opacity`. */
  opacity?: number
  /**
   * Aceptada por consistencia de API. El spotlight responde a input directo
   * del usuario y no desplaza contenido, así que permanece activo con
   * `prefers-reduced-motion` (precedente: behavior `hover` de PixelBackground).
   * Default: `true`.
   */
  respectReducedMotion?: boolean
  className?: string
  style?: CSSProperties
}
