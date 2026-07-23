'use client'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { enhanceHost } from '../../utils/enhance-host'
import { useBehavior, type BehaviorInstance } from '../shared/use-behavior'
import { attachTilt, type TiltEngineOptions } from './engine'
import type { UseTiltOptions } from './types'

function attachTiltToHost(
  node: HTMLElement,
  options: Pick<TiltEngineOptions, 'maxAngle' | 'perspective' | 'reducedMotion'>,
): BehaviorInstance<TiltEngineOptions> {
  const enhanced = enhanceHost(node, { styles: { willChange: 'transform' } })
  const engine = attachTilt(node, options)
  return {
    update: engine.update,
    destroy() {
      engine.destroy()
      enhanced.restore()
    },
  }
}

/**
 * Tilt 3D como behavior hook: aplica el efecto de `TiltCard` sobre el
 * elemento del consumer, sin wrapper. La perspectiva entra dentro del propio
 * transform (`perspective(N) rotateX() rotateY()`), así un solo elemento
 * escucha y rota. El efecto glare no está disponible en este modo (requiere
 * overlay y contexto `preserve-3d`): usá el componente `TiltCard`.
 *
 *   const tiltRef = useTilt({ maxAngle: 10 })
 *   <Card ref={tiltRef}>…</Card>
 *
 * Funciona con cualquier componente que forwardee `ref` a un nodo DOM.
 * Al desmontar restaura el host a su estado original.
 */
export function useTilt(options: UseTiltOptions = {}): (node: HTMLElement | null) => void {
  const { maxAngle = 15, perspective = 1000, respectReducedMotion = true } = options
  const prefersReduced = useReducedMotion()
  return useBehavior(attachTiltToHost, {
    maxAngle,
    perspective,
    reducedMotion: respectReducedMotion && prefersReduced,
  })
}
