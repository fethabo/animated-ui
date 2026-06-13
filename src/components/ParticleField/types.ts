import type { HTMLAttributes } from 'react'

/** Cómo reaccionan las partículas al cursor dentro del radio de influencia. */
export type CursorInteraction = 'repel' | 'attract' | 'none'

export interface ParticleFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Número de partículas en el campo. Default: `60`. */
  count?: number
  /**
   * Factor de velocidad inicial: rango de la velocidad aleatoria de cada
   * partícula en px/frame. Default: `0.4`.
   */
  speed?: number
  /** Radio de cada partícula en px. Default: `2`. También via `--aui-particle-radius`. */
  radius?: number
  /** Color de las partículas (cualquier color CSS). Default: `'#7c3aed'`. También via `--aui-particle-color`. */
  color?: string
  /**
   * Reacción al cursor dentro del radio de influencia. Default: `'repel'`.
   * `'none'` desactiva la interacción (las partículas solo se animan solas).
   */
  cursorInteraction?: CursorInteraction
  /** Radio de influencia del cursor en px. Default: `120`. */
  cursorRadius?: number
  /**
   * Si es `false`, la animación corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, el RAF se detiene
   * y el canvas muestra las partículas en su estado inicial estático).
   */
  respectReducedMotion?: boolean
}
