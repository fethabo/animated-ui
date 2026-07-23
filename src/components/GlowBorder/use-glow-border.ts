'use client'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useBehavior } from '../shared/use-behavior'
import { attachGlow, type GlowEngineOptions } from './engine'
import type { UseGlowBorderOptions } from './types'

function attachGlowToHost(node: HTMLElement, options: GlowEngineOptions) {
  return attachGlow(node, options)
}

/**
 * Glow border como behavior hook: aplica el anillo de gradiente cónico de
 * `GlowBorder` sobre el elemento del consumer, sin wrapper. El motor inyecta
 * la capa cónica como hija del host y aplica la clase `aui-glow` (padding
 * perimetral = ancho del glow, `overflow: hidden`, `isolation`), restaurando
 * todo al desmontar.
 *
 * Contrato del host: su padding pasa a ser el ancho del anillo, y el
 * contenido debe aportar su propio background (y border-radius acorde) para
 * tapar el centro del gradiente — el rol que en el componente cumple
 * `.aui-glow-content`. Si el host no puede ceder su padding, usá el
 * componente `GlowBorder`.
 *
 *   const glowRef = useGlowBorder({ speed: 6 })
 *   <div ref={glowRef}><Card>…</Card></div>
 *
 * Con `followCursor: true` el gradiente apunta hacia el cursor con momentum,
 * igual que en el componente (activo también bajo `prefers-reduced-motion`,
 * porque responde a input directo; el loop autónomo sí se detiene).
 */
export function useGlowBorder(options: UseGlowBorderOptions = {}): (node: HTMLElement | null) => void {
  const {
    colors,
    speed,
    width,
    radius,
    opacity,
    followCursor = false,
    respectReducedMotion = true,
  } = options
  const prefersReduced = useReducedMotion()
  return useBehavior(attachGlowToHost, {
    colors,
    speed,
    width,
    radius,
    opacity,
    followCursor,
    reducedMotion: respectReducedMotion && prefersReduced,
    decorate: true,
  })
}
