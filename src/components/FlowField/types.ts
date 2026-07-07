import type { HTMLAttributes } from 'react'

export interface FlowFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Cantidad de partículas trazando el campo. Default: `400`. */
  count?: number
  /** Velocidad de avance de las partículas en px/frame. Default: `1`. */
  speed?: number
  /**
   * Paleta de los trazos: cada partícula sortea su color. Default:
   * `['#22d3ee', '#a78bfa', '#f472b6']`. También via `--aui-flow-color-<i>`.
   */
  colors?: string[]
  /**
   * Persistencia del trazo (`0–1`): cuánto tarda en desvanecerse. Más alto ⇒
   * los trazos permanecen visibles más tiempo. Default: `0.95`.
   */
  fade?: number
  /**
   * Zoom del campo de ruido en px: a mayor `scale`, curvas más amplias y
   * suaves. Default: `200`.
   */
  scale?: number
  /**
   * Color de fondo que el componente pinta (necesario para el fade de los
   * trazos: el fondo NO es transparente, a diferencia de ParticleField).
   * Default: `'#0a0a12'`. También via `--aui-flow-background`.
   */
  background?: string
  /**
   * Semilla del campo y de las posiciones/respawns: la misma `seed` +
   * dimensiones producen la misma evolución (sin `Math.random`). Default: `'aui'`.
   */
  seed?: string | number
  /**
   * Si es `false`, la simulación corre aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, se dibuja una
   * composición estática de trazos pre-simulados, sin RAF).
   */
  respectReducedMotion?: boolean
}
