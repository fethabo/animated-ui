import type { CSSProperties, HTMLAttributes } from 'react'

export type AnimatedBackgroundVariantName =
  | 'aurora'
  | 'mesh'
  | 'noise'
  | 'beam'
  | 'lava'
  | 'grid'
  | 'rays'
  | 'dots'

export interface AnimatedBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Variante visual de la animación. Default: `'aurora'`. */
  variant?: AnimatedBackgroundVariantName
  /**
   * Paleta de colores de la animación. Cada variante usa hasta 4 colores;
   * los no provistos caen al default de la variante.
   */
  colors?: string[]
  /** Segundos que tarda un ciclo completo de la animación. */
  speed?: number
  /** Intensidad/opacidad global del efecto, de 0 a 1. Default: 1. */
  intensity?: number
  /**
   * Si es `true` usa `position: fixed` para cubrir el viewport completo.
   * Default: `false` (`position: absolute`, cubre el padre `relative`).
   */
  fixed?: boolean
  /**
   * Si es `false`, la animación corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true`.
   */
  respectReducedMotion?: boolean
  className?: string
  style?: CSSProperties
}

/** Definición interna de una variante: CSS estático + mapeo de props a CSS vars. */
export interface AnimatedBackgroundVariant {
  /** Sufijo usado en el nombre de clase (`aui-<name>`) y en el style tag ID. */
  name: AnimatedBackgroundVariantName
  /** CSS estático (clase + keyframes) inyectado una sola vez. */
  css: string
  /** Mapea props dinámicas a CSS custom properties inline (overrideables en cascada). */
  cssVars(opts: { colors?: string[]; speed?: number; intensity?: number }): Record<string, string>
}
