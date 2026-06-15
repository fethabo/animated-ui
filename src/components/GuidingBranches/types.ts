import type { HTMLAttributes, ReactNode } from 'react'
import type { TargetLike } from '../../utils/idle-target'
import type { AestheticName } from './aesthetics'

export type { AestheticName } from './aesthetics'

export interface GuidingBranchesProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Opcional. Elemento hacia el que sesgar las ramas: `RefObject`, `Element` o
   * selector CSS. El uso principal es **ambient** (sin `target`): las ramas se
   * expanden en los 360° alrededor del puntero hasta la frontera. Con `target`,
   * la rama dominante se sesga hacia él (modo directed).
   */
  target?: TargetLike
  /** Estética del trazo: `'roots'` (orgánico), `'lightning'` (rayo) o `'circuit'` (ortogonal). Default: `'roots'`. */
  aesthetic?: AestheticName
  /** Ms de inactividad del puntero antes de hacer crecer las ramas. Default: `2000`. */
  idleDelay?: number
  /** Color de las ramas. Default: `'#34d399'`. También via `--aui-branches-color`. */
  color?: string
  /**
   * Si es `true`, el trazo re-crece en ciclo: al completarse espera `duration`
   * ms y vuelve a crecer. Si es `false` (default), crece una vez y **queda
   * estático** hasta que el puntero se mueve (sin bucle).
   */
  loop?: boolean
  /** Ms que las ramas permanecen completas antes de re-crecer, cuando `loop`. Default: `1400`. También via `--aui-branches-duration`. */
  duration?: number
  /** Velocidad de dibujado del crecimiento en px/segundo. Default: `320`. También via `--aui-branches-speed`. */
  speed?: number
  /** Distancia máxima en px que cualquier rama puede alcanzar desde el puntero. Default: `260`. También via `--aui-branches-max-distance`. */
  maxDistance?: number
  /** Densidad de ramificación (cantidad de troncos / probabilidad de hijos). Default: `4`. */
  density?: number
  /** Profundidad máxima de sub-ramificación. Default: `3`. */
  depth?: number
  /** Grosor del trazo en px. Default: `2`. También via `--aui-branches-line-width`. */
  lineWidth?: number
  /**
   * Curvatura del trazo (0 = casi recto, 1 = muy sinuoso). Sube esto para que
   * `roots` parezca raíces orgánicas en vez de rayos. Default: `0.6`. También
   * via `--aui-branches-curl`. (Las estéticas ortogonales lo ignoran.)
   */
  curl?: number
  /** Jitter del trazo para estéticas tipo relámpago en px. Default: `0` (auto). También via `--aui-branches-jitter`. */
  jitter?: number
  /**
   * Si es `true` (default), con `prefers-reduced-motion` las ramas (efecto
   * autónomo por temporizador) NO se dibujan.
   */
  respectReducedMotion?: boolean
  /** Contenido monitoreado/superpuesto (el overlay no intercepta sus clicks). */
  children?: ReactNode
}
