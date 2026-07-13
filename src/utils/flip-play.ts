// Play WAAPI del motor FLIP: lanza `element.animate()` desde una inversión (o
// keyframes arbitrarios de entrada/salida/altura) y rastrea la animación
// activa de cada elemento en un `WeakMap` local a la instancia del componente
// (sin registro global). Lanzar sobre un elemento con animación en vuelo la
// cancela primero: el caller mide el First *visual* (getBoundingClientRect
// refleja el transform en vuelo) antes de cancelar, así el encadenado parte de
// la posición actual sin saltos (design.md, decisión 5).
import type { FlipInversion } from './flip'

/** Rastreo de animaciones por elemento, local a cada instancia de componente. */
export type AnimationTracker = WeakMap<Element, Animation>

/** Crea un tracker vacío (un `WeakMap` por instancia montada). */
export function createTracker(): AnimationTracker {
  return new WeakMap()
}

/** Timing común de los plays FLIP. `duration` en ms. */
export interface PlayTiming {
  duration: number
  easing: string
  delay?: number
}

/**
 * Cancela la animación rastreada del elemento (si la hay). El caller debe leer
 * la posición visual actual (`getBoundingClientRect`) *antes* de llamar, si la
 * necesita para encadenar.
 */
export function cancelTracked(tracker: AnimationTracker, element: Element): void {
  const active = tracker.get(element)
  if (active) {
    tracker.delete(element)
    active.cancel()
  }
}

/** `true` si el elemento tiene una animación rastreada en vuelo. */
export function hasTracked(tracker: AnimationTracker, element: Element): boolean {
  return tracker.has(element)
}

/**
 * Lanza `element.animate(keyframes, timing)` cancelando primero la animación
 * rastreada del elemento, y lo registra en el tracker (se desregistra solo al
 * terminar o cancelarse). `onSettled` corre una única vez cuando la animación
 * termina o se cancela (cleanup de estilos transitorios, remoción de clones).
 * Retorna `null` si el entorno no soporta WAAPI (jsdom sin stub): el caller
 * aplica el estado final sin animar.
 */
export function playKeyframes(
  tracker: AnimationTracker,
  element: Element,
  keyframes: Keyframe[],
  timing: PlayTiming,
  onSettled?: () => void,
): Animation | null {
  if (typeof element.animate !== 'function') return null
  cancelTracked(tracker, element)
  const animation = element.animate(keyframes, {
    duration: timing.duration,
    easing: timing.easing,
    delay: timing.delay ?? 0,
  })
  tracker.set(element, animation)
  let settled = false
  const clear = () => {
    if (settled) return
    settled = true
    if (tracker.get(element) === animation) tracker.delete(element)
    onSettled?.()
  }
  animation.onfinish = clear
  animation.oncancel = clear
  return animation
}

/**
 * Play de una inversión FLIP: anima el transform desde la inversión hacia
 * identidad. Emite `scale` solo si la inversión lo trae (≠1), para no pisar
 * transforms del consumer más de lo necesario.
 */
export function playInversion(
  tracker: AnimationTracker,
  element: Element,
  inversion: FlipInversion,
  timing: PlayTiming,
): Animation | null {
  const withScale = inversion.sx !== 1 || inversion.sy !== 1
  const from = withScale
    ? `translate(${inversion.dx}px, ${inversion.dy}px) scale(${inversion.sx}, ${inversion.sy})`
    : `translate(${inversion.dx}px, ${inversion.dy}px)`
  const to = withScale ? 'translate(0px, 0px) scale(1, 1)' : 'translate(0px, 0px)'
  return playKeyframes(tracker, element, [{ transform: from }, { transform: to }], timing)
}
