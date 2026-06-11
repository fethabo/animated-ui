'use client'
import { useCallback, useEffect, useRef, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { parallaxOffset } from './offset'
import type { MouseParallaxLayerProps, MouseParallaxProps } from './types'

export type { MouseParallaxLayerProps, MouseParallaxProps } from './types'

// Las capas se mueven con CSS puro sobre las vars que escribe el root: una
// transition en el compositor por capa, sin objetos de animación por evento.
// `translate` (propiedad independiente) no pisa `transform` del consumer.
const CSS = `
.aui-parallax {
  position: relative;
}
.aui-parallax-layer {
  translate: calc(var(--aui-parallax-x, 0) * var(--aui-parallax-depth, 20px))
    calc(var(--aui-parallax-y, 0) * var(--aui-parallax-depth, 20px));
  transition: translate var(--aui-parallax-ease, 0.2s) ease-out;
  will-change: translate;
}
`

/**
 * Capa de MouseParallax: se desplaza hasta `depth` px siguiendo al cursor
 * (negativo se opone). Usala como hija (directa o no) de `MouseParallax`.
 */
function MouseParallaxLayer({ depth, children, className, style, ...rest }: MouseParallaxLayerProps) {
  return (
    <div
      className={`aui-parallax-layer${className ? ` ${className}` : ''}`}
      style={{
        ...(depth !== undefined ? ({ '--aui-parallax-depth': `${depth}px` } as CSSProperties) : undefined),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * Contenedor de parallax creativo por mouse (sin scroll): las capas
 * declaradas con `MouseParallax.Layer` se desplazan según la posición del
 * cursor y su profundidad.
 *
 * El tracking escribe `--aui-parallax-x/y` (normalizadas a [-1, 1] respecto
 * del centro) directamente sobre el root — sin estado de React: mover el
 * mouse no re-renderiza los children (patrón SpotlightCard).
 */
export function MouseParallax({
  ease,
  respectReducedMotion = true,
  children,
  className,
  style,
  onMouseMove,
  onMouseLeave,
  ...rest
}: MouseParallaxProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const active = !(respectReducedMotion && reducedMotion)

  useEffect(() => {
    injectStyles(styleId('mouse-parallax'), CSS)
  }, [])

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const root = rootRef.current
      if (root && active) {
        const { x, y } = parallaxOffset(root.getBoundingClientRect(), event.clientX, event.clientY)
        root.style.setProperty('--aui-parallax-x', String(x))
        root.style.setProperty('--aui-parallax-y', String(y))
      }
      onMouseMove?.(event)
    },
    [active, onMouseMove],
  )

  const handleMouseLeave = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const root = rootRef.current
      if (root) {
        root.style.setProperty('--aui-parallax-x', '0')
        root.style.setProperty('--aui-parallax-y', '0')
      }
      onMouseLeave?.(event)
    },
    [onMouseLeave],
  )

  return (
    <div
      ref={rootRef}
      className={`aui-parallax${className ? ` ${className}` : ''}`}
      style={{
        ...(ease !== undefined ? ({ '--aui-parallax-ease': `${ease}s` } as CSSProperties) : undefined),
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </div>
  )
}

MouseParallax.Layer = MouseParallaxLayer
