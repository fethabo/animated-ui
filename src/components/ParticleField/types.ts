import type { HTMLAttributes } from 'react'

/** Cómo reaccionan las partículas al cursor dentro del radio de influencia. */
export type CursorInteraction = 'repel' | 'attract' | 'none'

/**
 * Modo de deriva del movimiento de las partículas.
 * - `'bounce'` (default): velocidad aleatoria + rebote en bordes (comportamiento original).
 * - `'snow'`: caen hacia abajo con deriva horizontal suave; wrap por arriba.
 * - `'embers'`: ascienden desvaneciéndose por vida; reingresan desde abajo.
 * - `'bubbles'`: ascienden con bamboleo lateral sinusoidal; wrap por abajo.
 * - `'warp'`: nacen en un punto central-superior y se aceleran radialmente hacia
 *   afuera (abajo y a los costados), como un campo de estrellas / avance espacial;
 *   al salir del área reingresan cerca del punto de origen.
 */
export type DriftMode = 'bounce' | 'snow' | 'embers' | 'bubbles' | 'warp'

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
   * Modo de deriva del movimiento. Default: `'bounce'` (comportamiento original).
   * Los modos direccionales (`snow`/`embers`/`bubbles`) reingresan las
   * partículas por el borde opuesto (wrap) en vez de rebotar.
   */
  drift?: DriftMode
  /**
   * Dibuja líneas de conexión entre partículas cercanas (efecto constellation).
   * Default: `false`. Introduce un cálculo entre pares O(N²) **opt-in**: con
   * `false` no se ejecuta ningún loop entre pares y el costo permanece O(N).
   */
  links?: boolean
  /** Distancia máxima en px para conectar dos partículas con una línea. Default: `120`. También via `--aui-particle-link-distance`. */
  linkDistance?: number
  /** Color de las líneas de conexión. Default: deriva del `color` de partícula con alpha reducido. También via `--aui-particle-link-color`. */
  linkColor?: string
  /** Grosor de las líneas de conexión en px. Default: `1`. También via `--aui-particle-link-width`. */
  linkWidth?: number
  /**
   * Conectar también las partículas cercanas al cursor con líneas hacia él.
   * Default: `true` (solo aplica cuando `links` está activo y hay cursor).
   */
  linkCursor?: boolean
  /**
   * Si es `false`, la animación corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, el RAF se detiene
   * y el canvas muestra las partículas en su estado inicial estático).
   */
  respectReducedMotion?: boolean
}
