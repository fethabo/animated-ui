import type { HTMLAttributes } from 'react'

/** Orientación del dock: fila horizontal (default) o columna vertical. */
export type DockOrientation = 'horizontal' | 'vertical'

export interface DockProps extends HTMLAttributes<HTMLDivElement> {
  /** Escala máxima del ítem bajo el cursor. Default: `1.5`. */
  magnification?: number
  /** Radio de influencia del cursor en px (a esa distancia la escala vuelve a 1). Default: `120`. */
  radius?: number
  /** Separación entre ítems en px. Default: `8`. También via `--aui-dock-gap`. */
  gap?: number
  /** Orientación de la fila y del eje de magnificación. Default: `'horizontal'`. */
  orientation?: DockOrientation
  /** Duración del retorno a escala base en segundos. Default: `0.25`. También via `--aui-dock-return`. */
  returnDuration?: number
  /**
   * Si es `false`, la magnificación opera aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con reduce, fila estática).
   */
  respectReducedMotion?: boolean
}

export interface DockItemProps extends HTMLAttributes<HTMLDivElement> {}
