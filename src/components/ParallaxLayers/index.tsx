'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { subscribeScroll, viewportProgress } from '../../utils/scroll-driver'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { ParallaxLayersLayerProps, ParallaxLayersProps } from './types'

export type { ParallaxLayersLayerProps, ParallaxLayersProps } from './types'

// Sin transition: el scroll ya es una entrada continua; suavizarla agregaría
// lag tipo "rubber band" (a diferencia del mouse, donde la transition ayuda).
const CSS = `
.aui-parallax-scroll {
  position: relative;
}
.aui-parallax-scroll-layer {
  translate: 0 calc(var(--aui-parallax-scroll, 0) * var(--aui-parallax-scroll-depth, 40px));
  will-change: translate;
}
`

/**
 * Capa de ParallaxLayers: se desplaza hasta `depth` px a lo largo del
 * recorrido del contenedor por el viewport (negativo va contra el scroll).
 * Usala como hija (directa o no) de `ParallaxLayers`.
 */
function ParallaxLayersLayer({ depth, children, className, style, ...rest }: ParallaxLayersLayerProps) {
  return (
    <div
      className={`aui-parallax-scroll-layer${className ? ` ${className}` : ''}`}
      style={{
        ...(depth !== undefined ? ({ '--aui-parallax-scroll-depth': `${depth}px` } as CSSProperties) : undefined),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * Contenedor de capas con profundidad ligadas a la posición de scroll —
 * el primo de scroll de `MouseParallax`, con la misma API de `Layer`.
 *
 * El progreso del contenedor por el viewport ([-1, 1]) se escribe como
 * `--aui-parallax-scroll` directamente sobre el root (sin estado de React);
 * las capas se trasladan con `calc()` puro. El tracking solo corre mientras
 * el contenedor está cerca del viewport (`useInView`): N contenedores fuera
 * de pantalla cuestan cero por frame.
 */
export function ParallaxLayers({
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: ParallaxLayersProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const inView = useInView(rootRef, { once: false, rootMargin: '100px', threshold: 0 })
  const active = inView && !(respectReducedMotion && reducedMotion)

  useEffect(() => {
    injectStyles(styleId('parallax-layers'), CSS)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!active) {
      root.style.setProperty('--aui-parallax-scroll', '0')
      return
    }
    return subscribeScroll(() => {
      const rect = root.getBoundingClientRect()
      root.style.setProperty(
        '--aui-parallax-scroll',
        String(viewportProgress(rect.top, rect.height, window.innerHeight)),
      )
    })
  }, [active])

  return (
    <div ref={rootRef} className={`aui-parallax-scroll${className ? ` ${className}` : ''}`} style={style} {...rest}>
      {children}
    </div>
  )
}

ParallaxLayers.Layer = ParallaxLayersLayer
