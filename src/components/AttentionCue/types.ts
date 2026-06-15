import type { HTMLAttributes, ReactNode } from 'react'
import type { TargetLike } from '../../utils/idle-target'

/** Estilo de la punta del cue. */
export type CueHead = 'arrow' | 'dot' | 'none'

/** Qué dibuja el recorrido del cue: el haz de luz o una hilera de huellas. */
export type CueMarker = 'beam' | 'footprints'

export interface AttentionCueProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Elemento hacia el que dirigir el cue: un `RefObject`, un `Element` o un
   * selector CSS. Con `target` ⇒ modo directed; sin él ⇒ modo ambient.
   */
  target?: TargetLike
  /** Ms de inactividad del puntero antes de dibujar el cue. Default: `2000`. */
  idleDelay?: number
  /** Color del trazo del cue. Default: `'#fbbf24'`. También via `--aui-cue-color`. */
  color?: string
  /** Duración en ms del dibujado del trazo. Default: `700`. También via `--aui-cue-duration`. */
  duration?: number
  /** Velocidad de avance del trazo en px/segundo. Default: `420`. También via `--aui-cue-speed`. */
  speed?: number
  /** Distancia máxima en px que el cue puede alcanzar desde el puntero. Default: `220`. También via `--aui-cue-max-distance`. */
  maxDistance?: number
  /** Grosor del trazo en px. Default: `3`. También via `--aui-cue-line-width`. */
  lineWidth?: number
  /** Estilo de la punta: `'arrow'` (flecha), `'dot'` (punto) o `'none'`. Default: `'arrow'`. */
  head?: CueHead
  /**
   * Qué recorre el camino: `'beam'` (haz de luz, default) o `'footprints'`
   * (huellas que avanzan hacia el destino, alternando izquierda/derecha).
   */
  marker?: CueMarker
  /**
   * Curvatura del trazo (0 = recto, 1 = muy curvo). El trazo se arquea hacia un
   * costado en vez de ir derecho. Default: `0`. También via `--aui-cue-curve`.
   */
  curve?: number
  /**
   * Si es `true`, dibuja además una línea-guía tenue bajo el destello. Por
   * default (`false`) se muestra **solo la luz** (el cometa con glow), que
   * aparece y se desvanece como un destello, sin línea sólida.
   */
  showGuide?: boolean
  /**
   * Si es `true` (default), con `prefers-reduced-motion` el cue (efecto
   * autónomo por temporizador) NO se dibuja.
   */
  respectReducedMotion?: boolean
  /** Contenido monitoreado/superpuesto (el overlay no intercepta sus clicks). */
  children?: ReactNode
}
