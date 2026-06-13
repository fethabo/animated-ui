import type { HTMLAttributes } from 'react'

export interface StickyScenesProps extends HTMLAttributes<HTMLDivElement> {
  /** Escenas declaradas con `StickyScenes.Scene`. */
  children?: React.ReactNode
  /**
   * Píxeles de scroll dedicados a cada escena antes de transicionar a la
   * siguiente. Default: `600`. La altura total del contenedor es
   * `100dvh + nScenes × sceneDuration`.
   */
  sceneDuration?: number
  /**
   * Si es `false`, las transitions de las escenas corren aunque el sistema
   * tenga activado `prefers-reduced-motion`. Default: `true` (con reduce, el
   * tracking de scroll sigue activo pero las transitions se anulan con
   * `transition: none`, mostrando cada escena de inmediato).
   */
  respectReducedMotion?: boolean
}

export interface StickySceneProps extends HTMLAttributes<HTMLDivElement> {
  /** Contenido de la escena. */
  children?: React.ReactNode
}
