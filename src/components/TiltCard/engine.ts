import type { TiltState } from './types'

export interface TiltEngineOptions {
  /** Ángulo máximo de rotación en grados. */
  maxAngle: number
  /** Con `true` no hay rotación; el estado sigue reportando `isHovering`. */
  reducedMotion: boolean
  /**
   * Profundidad de perspectiva en px, aplicada dentro del propio transform
   * (`perspective(N) rotateX() rotateY()`). Modo hook: el host es a la vez
   * quien escucha y quien rota, sin wrapper externo. Con `undefined` (modo
   * componente) el transform es solo rotación y la perspectiva la aporta el
   * elemento padre.
   */
  perspective?: number
  /** Reporta cada cambio de estado (render prop / glare del componente). */
  onState?: (state: TiltState) => void
}

export interface TiltEngineInstance {
  /** Merge de opciones en vivo; no reconstruye listeners. */
  update(patch: Partial<TiltEngineOptions>): void
  /** Remueve listeners y deja el target sin rotación residual. */
  destroy(): void
}

/**
 * Motor imperativo del efecto tilt (DOM puro, sin React): listeners de mouse
 * sobre `host` y rotación WAAPI sobre `target` (por default el mismo host).
 * Cada movimiento anima hacia el ángulo objetivo con `fill: 'forwards'`,
 * consolidando la animación anterior (`commitStyles`) para interpolar desde
 * el estado visual actual — eso preserva el momentum al cambiar de dirección.
 */
export function attachTilt(
  host: HTMLElement,
  options: TiltEngineOptions,
  target: HTMLElement = host,
): TiltEngineInstance {
  let current = { ...options }
  let animation: Animation | null = null
  let state: TiltState = { tiltX: 0, tiltY: 0, isHovering: false }

  const transformFor = (tiltX: number, tiltY: number) => {
    const rotation = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
    return current.perspective !== undefined
      ? `perspective(${current.perspective}px) ${rotation}`
      : rotation
  }

  const apply = (tiltX: number, tiltY: number, isHovering: boolean) => {
    // `|| 0` normaliza el -0 que produce la multiplicación sobre el eje.
    state = { tiltX: tiltX || 0, tiltY: tiltY || 0, isHovering }
    current.onState?.(state)

    if (typeof target.animate !== 'function') return
    const previous = animation
    if (previous) {
      try {
        previous.commitStyles()
      } catch {
        // commitStyles falla si el elemento ya no está renderizado; se ignora.
      }
      previous.cancel()
    }
    animation = target.animate([{ transform: transformFor(state.tiltX, state.tiltY) }], {
      duration: 150,
      fill: 'forwards',
      easing: 'ease-out',
    })
  }

  const onMouseMove = (event: MouseEvent) => {
    if (current.reducedMotion) {
      apply(0, 0, true)
      return
    }
    const rect = host.getBoundingClientRect()
    const relX = (event.clientX - rect.left) / rect.width - 0.5
    const relY = (event.clientY - rect.top) / rect.height - 0.5
    // Mouse a la derecha → rotateY positivo; mouse arriba → rotateX positivo.
    apply(-relY * 2 * current.maxAngle, relX * 2 * current.maxAngle, true)
  }

  const onMouseEnter = () => {
    if (!state.isHovering) apply(0, 0, true)
  }

  const onMouseLeave = () => {
    apply(0, 0, false)
  }

  host.addEventListener('mousemove', onMouseMove)
  host.addEventListener('mouseenter', onMouseEnter)
  host.addEventListener('mouseleave', onMouseLeave)

  return {
    update(patch) {
      current = { ...current, ...patch }
      // Si reduce se activó en caliente con el cursor encima, plancha el tilt.
      if (patch.reducedMotion && state.isHovering) apply(0, 0, true)
    },
    destroy() {
      host.removeEventListener('mousemove', onMouseMove)
      host.removeEventListener('mouseenter', onMouseEnter)
      host.removeEventListener('mouseleave', onMouseLeave)
      if (animation) {
        animation.cancel()
        animation = null
      }
    },
  }
}
