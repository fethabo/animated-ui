import { injectStyles, styleId } from '../../utils/inject-styles'
import { createLayer, enhanceHost, type EnhancedHost } from '../../utils/enhance-host'
import { spotlightVars, type SpotlightVarsInput } from './vars'

export const SPOTLIGHT_CSS = `
.aui-spotlight {
  position: relative;
}
.aui-spotlight-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: radial-gradient(
    circle var(--aui-spotlight-radius, 250px) at var(--aui-spotlight-x, 50%) var(--aui-spotlight-y, 50%),
    var(--aui-spotlight-color, rgba(255, 255, 255, 0.15)) 0%,
    transparent 100%
  );
  z-index: 1;
}
.aui-spotlight[data-aui-hover] > .aui-spotlight-overlay {
  opacity: var(--aui-spotlight-opacity, 1);
}
`

export interface SpotlightEngineOptions extends SpotlightVarsInput {
  /**
   * Modo hook: el motor decora el host (clase root, CSS vars estéticas y
   * overlay inyectado) y lo restaura al destruir. El componente pasa `false`
   * porque su JSX ya renderiza clase, vars y overlay (visibles en SSR).
   */
  decorate: boolean
}

export interface SpotlightEngineInstance {
  /** Merge de opciones en vivo; re-aplica vars sin reconstruir listeners ni capas. */
  update(patch: Partial<SpotlightEngineOptions>): void
  /** Remueve listeners y restaura el host (overlay, clase, vars, atributo hover). */
  destroy(): void
}

/**
 * Motor imperativo del spotlight (DOM puro, sin React): el tracking del
 * cursor escribe `--aui-spotlight-x/y` directamente sobre el host (sin
 * re-renders) y el hover se expresa con el atributo `data-aui-hover`. El
 * overlay tiene `pointer-events: none`: el contenido sigue interactivo.
 *
 * El spotlight responde a input directo del usuario y no desplaza contenido,
 * así que permanece activo bajo `prefers-reduced-motion` (misma semántica
 * que el componente; precedente: behavior `hover` de PixelBackground).
 */
export function attachSpotlight(
  host: HTMLElement,
  options: SpotlightEngineOptions,
): SpotlightEngineInstance {
  let current = { ...options }
  injectStyles(styleId('spotlight-card'), SPOTLIGHT_CSS)

  let enhanced: EnhancedHost | null = null
  if (current.decorate) {
    enhanced = enhanceHost(host, {
      classes: ['aui-spotlight'],
      vars: spotlightVars(current),
      layers: [createLayer('aui-spotlight-overlay')],
    })
  }

  const onMouseMove = (event: MouseEvent) => {
    const rect = host.getBoundingClientRect()
    host.style.setProperty('--aui-spotlight-x', `${event.clientX - rect.left}px`)
    host.style.setProperty('--aui-spotlight-y', `${event.clientY - rect.top}px`)
  }
  const onMouseEnter = () => {
    host.setAttribute('data-aui-hover', '')
  }
  const onMouseLeave = () => {
    host.removeAttribute('data-aui-hover')
  }

  host.addEventListener('mousemove', onMouseMove)
  host.addEventListener('mouseenter', onMouseEnter)
  host.addEventListener('mouseleave', onMouseLeave)

  return {
    update(patch) {
      current = { ...current, ...patch }
      enhanced?.setVars(spotlightVars(current))
    },
    destroy() {
      host.removeEventListener('mousemove', onMouseMove)
      host.removeEventListener('mouseenter', onMouseEnter)
      host.removeEventListener('mouseleave', onMouseLeave)
      host.removeAttribute('data-aui-hover')
      host.style.removeProperty('--aui-spotlight-x')
      host.style.removeProperty('--aui-spotlight-y')
      enhanced?.restore()
    },
  }
}
