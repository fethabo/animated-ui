'use client'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { enhanceHost } from '../../utils/enhance-host'
import { useBehavior, type BehaviorInstance } from '../shared/use-behavior'
import { attachMagnetic, type MagneticEngineOptions } from './engine'
import type { UseMagneticOptions } from './types'

function attachMagneticToHost(
  node: HTMLElement,
  options: Pick<MagneticEngineOptions, 'strength' | 'reducedMotion'>,
): BehaviorInstance<MagneticEngineOptions> {
  const enhanced = enhanceHost(node, { styles: { willChange: 'transform' } })
  const engine = attachMagnetic(node, options)
  return {
    update: engine.update,
    destroy() {
      engine.destroy()
      enhanced.restore()
    },
  }
}

/**
 * Efecto magnético como behavior hook: el elemento del consumer se atrae
 * hacia el cursor mientras está encima y vuelve con retorno elástico al
 * salir — sin wrapper. La zona de atracción es el área del propio elemento:
 * la zona extendida (`hitArea`) requiere el wrapper de padding del
 * componente `MagneticElement` (criterio: sin listeners globales).
 *
 *   const magneticRef = useMagnetic({ strength: 0.5 })
 *   <Button ref={magneticRef}>…</Button>
 *
 * Funciona con cualquier componente que forwardee `ref` a un nodo DOM.
 * Al desmontar restaura el host a su estado original.
 */
export function useMagnetic(options: UseMagneticOptions = {}): (node: HTMLElement | null) => void {
  const { strength = 0.35, respectReducedMotion = true } = options
  const prefersReduced = useReducedMotion()
  return useBehavior(attachMagneticToHost, {
    strength,
    reducedMotion: respectReducedMotion && prefersReduced,
  })
}
