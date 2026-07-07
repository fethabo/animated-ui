import type { HTMLAttributes } from 'react'

/** Forma de cada copo de confetti. */
export type ConfettiShape = 'rect' | 'circle'

/** Origen de la ráfaga, relativo al contenedor: `0–1` por eje (`{x:0.5, y:0.5}` = centro). */
export interface ConfettiOrigin {
  x: number
  y: number
}

/**
 * Opciones de un disparo individual de `fire(options?)`. Cada campo overridea
 * la prop homónima del componente **solo para esa ráfaga** — las props quedan
 * como defaults de los disparos siguientes.
 */
export interface FireOptions {
  /** Cantidad de copos de la ráfaga. */
  count?: number
  /** Paleta de la ráfaga: cada copo sortea su color de acá. */
  colors?: string[]
  /** Formas disponibles para los copos. */
  shapes?: ConfettiShape[]
  /** Origen de la ráfaga, relativo al contenedor (`0–1` por eje). */
  origin?: ConfettiOrigin
  /** Dirección central del abanico en grados; `90` = hacia arriba. */
  angle?: number
  /** Apertura total del cono en grados. */
  spread?: number
  /** Velocidad inicial en px/frame (potencia de la ráfaga). */
  power?: number
  /** Gravedad en px/frame² (cuánto y qué tan rápido caen los copos). */
  gravity?: number
}

/**
 * Handle imperativo expuesto por `ConfettiBurst` via ref: tipá tu
 * `useRef<ConfettiBurstHandle>(null)` con esto y disparás con
 * `ref.current?.fire()`.
 */
export interface ConfettiBurstHandle {
  /**
   * Dispara una ráfaga de confetti. Las `options` overridean las props del
   * componente para esta ráfaga. Disparos sucesivos se acumulan sobre el
   * mismo canvas. No-op antes de la hidratación y bajo
   * `prefers-reduced-motion` (con `respectReducedMotion` activo).
   */
  fire(options?: FireOptions): void
}

export interface ConfettiBurstProps extends HTMLAttributes<HTMLDivElement> {
  /** Cantidad de copos por ráfaga. Default: `80`. */
  count?: number
  /**
   * Paleta default: cada copo sortea su color de acá. Default: paleta festiva
   * de 5 colores. También via `--aui-confetti-color-<i>`.
   */
  colors?: string[]
  /** Formas disponibles para los copos. Default: `['rect', 'circle']`. */
  shapes?: ConfettiShape[]
  /** Origen default de las ráfagas, relativo al contenedor (`0–1`). Default: `{x: 0.5, y: 0.5}`. */
  origin?: ConfettiOrigin
  /** Dirección central del abanico en grados; `90` = hacia arriba. Default: `90`. */
  angle?: number
  /** Apertura total del cono en grados. Default: `60`. */
  spread?: number
  /** Velocidad inicial en px/frame. Default: `12`. */
  power?: number
  /** Gravedad en px/frame². Default: `0.25`. */
  gravity?: number
  /**
   * Si es `false`, `fire()` anima aunque el sistema tenga activado
   * `prefers-reduced-motion`. Default: `true` (con la preferencia activa,
   * `fire()` es un no-op: el confetti es celebración autónoma sin versión
   * estática útil — el feedback alternativo corre por cuenta del consumer).
   */
  respectReducedMotion?: boolean
}
