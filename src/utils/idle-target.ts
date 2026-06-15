/*
 * Modelo compartido de "idle + target" (ver design.md, Decisión 4) entre
 * `AttentionCue` y `GuidingBranches`. Encapsula:
 *  - la geometría pura cursor→target (vector, ángulo, distancia, clamp), y
 *  - la resolución de `target` (`RefObject | Element | selector`) a un Element,
 *  - un watcher de inactividad (timer que se resetea en pointermove/leave).
 * Interno al paquete. La geometría es pura y testeable; el watcher toca el DOM.
 */
import type { RefObject } from 'react'

export interface Point {
  x: number
  y: number
}

export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

/** Aceptamos un ref, un elemento, un selector CSS, o nada (modo ambient). */
export type TargetLike = RefObject<Element | null> | Element | string | null | undefined

/** Centro de un rect. Función pura. */
export function rectCenter(rect: Rect): Point {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

export interface TargetVector {
  dx: number
  dy: number
  distance: number
  /** Ángulo en radianes desde `from` hacia el centro del rect. */
  angle: number
}

/**
 * Vector desde `from` hacia el centro de `rect`: componentes, distancia y
 * ángulo. Función pura. Si la distancia es 0, el ángulo es 0.
 */
export function vectorTo(from: Point, rect: Rect): TargetVector {
  const center = rectCenter(rect)
  const dx = center.x - from.x
  const dy = center.y - from.y
  const distance = Math.hypot(dx, dy)
  const angle = distance === 0 ? 0 : Math.atan2(dy, dx)
  return { dx, dy, distance, angle }
}

/** Limita una distancia a `max` (si `max > 0`). Función pura. */
export function clampDistance(distance: number, max: number): number {
  return max > 0 ? Math.min(distance, max) : distance
}

/**
 * Resuelve un `target` a un Element. Acepta `RefObject`, `Element` o un selector
 * CSS (resuelto con `document.querySelector`). SSR-safe: sin `document`, o si no
 * matchea, devuelve `null` (el consumer degrada a modo ambient sin error).
 */
export function resolveTargetElement(target: TargetLike): Element | null {
  if (!target) return null
  if (typeof target === 'string') {
    if (typeof document === 'undefined') return null
    return document.querySelector(target)
  }
  if (target instanceof Element) return target
  // RefObject
  return target.current ?? null
}

export interface IdleWatcherOptions {
  /** Elemento monitoreado; los movimientos relativos se calculan contra su rect. */
  element: HTMLElement
  /** Ms de inactividad antes de disparar `onIdle`. */
  idleDelay: number
  /** Se llama al cumplirse `idleDelay`, con la última posición del cursor (relativa al elemento). */
  onIdle: (cursor: Point) => void
  /** Se llama ante cualquier movimiento/salida del puntero (retracción + reset). */
  onActive: () => void
}

/**
 * Crea un watcher de inactividad sobre `element`: arranca un timer que dispara
 * `onIdle` tras `idleDelay` sin movimiento; cualquier `pointermove`/`pointerleave`
 * llama `onActive` y reinicia el timer. Touch no inicia seguimiento de cursor.
 * Devuelve la función de cleanup. SSR-safe (sin `window` es no-op).
 */
export function createIdleWatcher({ element, idleDelay, onIdle, onActive }: IdleWatcherOptions): () => void {
  if (typeof window === 'undefined') return () => {}

  let cursor: Point = { x: 0, y: 0 }
  let timer: ReturnType<typeof setTimeout> | undefined

  const arm = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => onIdle(cursor), idleDelay)
  }

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    const rect = element.getBoundingClientRect()
    cursor = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    onActive()
    arm()
  }
  const onLeave = () => {
    if (timer) clearTimeout(timer)
    timer = undefined
    onActive()
  }

  element.addEventListener('pointermove', onMove)
  element.addEventListener('pointerleave', onLeave)
  arm()

  return () => {
    if (timer) clearTimeout(timer)
    timer = undefined
    element.removeEventListener('pointermove', onMove)
    element.removeEventListener('pointerleave', onLeave)
  }
}
