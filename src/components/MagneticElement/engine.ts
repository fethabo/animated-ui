import { magneticOffset } from './offset'
import type { MagneticState } from './types'

// Easing back-out: retorno con leve rebote elástico al soltar el contenido.
const ELASTIC_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

export interface MagneticEngineOptions {
  /** Fuerza de atracción (0 a 1). */
  strength: number
  /** Con `true` el contenido no se mueve; el estado sigue reportando `isActive`. */
  reducedMotion: boolean
  /** Reporta cada cambio de estado (render prop del componente). */
  onState?: (state: MagneticState) => void
}

export interface MagneticEngineInstance {
  /** Merge de opciones en vivo; no reconstruye listeners. */
  update(patch: Partial<MagneticEngineOptions>): void
  /** Remueve listeners y deja el target sin traslación residual. */
  destroy(): void
}

/**
 * Motor imperativo del efecto magnético (DOM puro, sin React): listeners de
 * mouse sobre `host` (que define la zona de atracción con su propia área) y
 * traslación WAAPI sobre `target` (por default el mismo host). Cada
 * movimiento anima hacia el offset objetivo consolidando la animación
 * anterior (`commitStyles`) para preservar momentum; al salir el retorno usa
 * un easing back-out elástico.
 */
export function attachMagnetic(
  host: HTMLElement,
  options: MagneticEngineOptions,
  target: HTMLElement = host,
): MagneticEngineInstance {
  let current = { ...options }
  let animation: Animation | null = null
  let state: MagneticState = { offsetX: 0, offsetY: 0, isActive: false }

  const apply = (offsetX: number, offsetY: number, isActive: boolean, elastic: boolean) => {
    state = { offsetX, offsetY, isActive }
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
    animation = target.animate(
      [{ transform: `translate(${offsetX}px, ${offsetY}px)` }],
      elastic
        ? { duration: 450, fill: 'forwards', easing: ELASTIC_EASING }
        : { duration: 150, fill: 'forwards', easing: 'ease-out' },
    )
  }

  const onMouseMove = (event: MouseEvent) => {
    if (current.reducedMotion) {
      if (!state.isActive) apply(0, 0, true, false)
      return
    }
    const rect = host.getBoundingClientRect()
    const { offsetX, offsetY } = magneticOffset(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect.width,
      rect.height,
      current.strength,
    )
    apply(offsetX, offsetY, true, false)
  }

  const onMouseLeave = () => {
    apply(0, 0, false, true)
  }

  host.addEventListener('mousemove', onMouseMove)
  host.addEventListener('mouseleave', onMouseLeave)

  return {
    update(patch) {
      current = { ...current, ...patch }
      // Si reduce se activó en caliente con el cursor encima, plancha el offset.
      if (patch.reducedMotion && state.isActive) apply(0, 0, true, false)
    },
    destroy() {
      host.removeEventListener('mousemove', onMouseMove)
      host.removeEventListener('mouseleave', onMouseLeave)
      if (animation) {
        animation.cancel()
        animation = null
      }
    },
  }
}
