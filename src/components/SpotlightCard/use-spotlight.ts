'use client'
import { useBehavior } from '../shared/use-behavior'
import { attachSpotlight, type SpotlightEngineOptions } from './engine'
import type { UseSpotlightOptions } from './types'

function attachSpotlightToHost(node: HTMLElement, options: SpotlightEngineOptions) {
  return attachSpotlight(node, options)
}

/**
 * Spotlight radial como behavior hook: aplica el efecto de `SpotlightCard`
 * sobre el elemento del consumer, sin wrapper. El motor inyecta el overlay
 * como hija del host (con `border-radius: inherit` y `pointer-events: none`)
 * y lo remueve al desmontar; el tracking escribe CSS vars sin re-renders.
 *
 *   const spotlightRef = useSpotlight({ radius: 300 })
 *   <Card ref={spotlightRef}>…</Card>
 *
 * Funciona con cualquier componente que forwardee `ref` a un nodo DOM.
 * Como en el componente, el efecto responde a input directo y permanece
 * activo bajo `prefers-reduced-motion`.
 */
export function useSpotlight(options: UseSpotlightOptions = {}): (node: HTMLElement | null) => void {
  const { color, radius, opacity } = options
  return useBehavior(attachSpotlightToHost, { color, radius, opacity, decorate: true })
}
