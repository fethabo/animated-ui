'use client'
import { useEffect, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { borderBeamCss } from './styles'
import type { BorderBeamProps } from './types'

export type { BorderBeamProps } from './types'

// Solo la cabeza del cometa sigue el perímetro con precisión: es un nodo
// posicionado con `offset-path: border-box` + `offset-distance` animado
// 0→100% (sin JS por frame). El nodo es rígido y `offset-path` lo traslada
// y rota pero no lo deforma, así que en las esquinas la estela quedaría
// recta sobre la tangente, saliéndose de la curva. Para evitarlo, la capa
// se enmascara al anillo del borde (`mask-clip: padding-box, border-box` +
// `mask-composite: intersect`): solo se pinta la banda entre `border-box` y
// `padding-box`, así que del cometa solo se ve la intersección con ese
// anillo curvo y perceptualmente dobla la esquina. En browsers sin soporte
// de `offset-path: border-box` o del enmascarado compuesto, `@supports`
// oculta el cometa dejando contenedor y children intactos. La capa es
// `pointer-events: none`: los clicks pasan.

/**
 * Cometa de luz (cabeza brillante con estela en degradé) que recorre el
 * perímetro del borde del contenedor en loop continuo — CSS casi puro
 * (`offset-path: border-box` para la cabeza + enmascarado de la capa al
 * anillo del borde para confinar la estela a la curva), sin JS por frame.
 * Hermano estético de GlowBorder (que anima el gradiente completo; acá
 * viaja un cometa puntual).
 *
 * Dale `border-radius` al propio componente (via `className`/`style`) y el
 * recorrido lo respeta. Varias instancias se desincronizan con `delay`. En
 * browsers sin `offset-path: border-box` el cometa se oculta sin romper
 * nada. Con `prefers-reduced-motion` muestra un realce de borde estático.
 */
export function BorderBeam({
  colorFrom = '#7c3aed',
  colorTo = '#0ea5e9',
  size = 96,
  duration = 6,
  delay = 0,
  borderWidth = 2,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: BorderBeamProps) {
  useEffect(() => {
    injectStyles(styleId('border-beam'), borderBeamCss())
  }, [])

  return (
    <div
      className={`aui-border-beam${className ? ` ${className}` : ''}`}
      data-aui-motion={respectReducedMotion ? undefined : ''}
      style={
        {
          '--aui-beam-color-from': colorFrom,
          '--aui-beam-color-to': colorTo,
          '--aui-beam-size': `${size}px`,
          '--aui-beam-duration': `${duration}s`,
          '--aui-beam-delay': `${delay}s`,
          '--aui-beam-border-width': `${borderWidth}px`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <div aria-hidden="true" className="aui-border-beam-layer">
        <div className="aui-border-beam-comet" />
      </div>
      {children}
    </div>
  )
}

/**
 * Registra el CSS de BorderBeam para usarlo en modo clase, sin montar el componente.
 * Inyecta los estilos una sola vez en el <head> de forma idempotente.
 */
export function registerBorderBeam(): void {
  injectStyles(styleId('border-beam'), borderBeamCss())
}
