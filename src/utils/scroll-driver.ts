/*
 * Motor de scroll de posición continua (decisión de v0.5, ver
 * openspec/changes/.../design.md): listener pasivo + RAF que alimenta CSS
 * custom properties. Interno al paquete — se promueve a hook público recién
 * cuando un tercer consumidor lo justifique.
 */

/**
 * Suscribe un callback al scroll/resize del documento, coalescido por
 * `requestAnimationFrame`: por más eventos que lleguen, el callback corre a
 * lo sumo una vez por frame. Se ejecuta una vez al suscribir (posición
 * inicial) y retorna la función de cleanup.
 *
 * SSR-safe: sin `window` retorna un cleanup no-op.
 */
export function subscribeScroll(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  let rafId = 0
  const schedule = () => {
    if (rafId) return
    rafId = window.requestAnimationFrame(() => {
      rafId = 0
      callback()
    })
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  schedule()

  return () => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    if (rafId) window.cancelAnimationFrame(rafId)
    rafId = 0
  }
}

/**
 * Progreso de un elemento a través del viewport, normalizado a [-1, 1]:
 * -1 cuando recién asoma por abajo, 0 cuando su centro coincide con el
 * centro del viewport, 1 cuando termina de salir por arriba. Clampeado.
 */
export function viewportProgress(rectTop: number, rectHeight: number, viewportHeight: number): number {
  const range = (viewportHeight + rectHeight) / 2
  if (range <= 0) return 0
  // Restado en este orden para que el caso centrado dé 0 positivo (no -0).
  const advance = viewportHeight / 2 - rectTop - rectHeight / 2
  return Math.max(-1, Math.min(1, advance / range))
}

/**
 * Progreso de scroll de la página, normalizado a [0, 1]. Retorna 0 si el
 * documento no tiene overflow (guarda de división por cero). Clampeado.
 */
export function pageProgress(scrollTop: number, scrollHeight: number, clientHeight: number): number {
  const max = scrollHeight - clientHeight
  if (max <= 0) return 0
  return Math.max(0, Math.min(1, scrollTop / max))
}
