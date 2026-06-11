'use client'
import { Children, useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { revealCss, revealVars } from './styles'
import type { ScrollRevealProps } from './types'

export type { RevealDirection, ScrollRevealProps } from './types'

/**
 * Revela su contenido al entrar al viewport, con stagger entre hijos directos.
 *
 * Cada hijo directo se envuelve en un `<div class="aui-reveal-item">` que
 * porta el estado oculto y la transición; el root (observado via `useInView`)
 * solo togglea `data-aui-visible`. El root acepta `className`/`style`, así
 * puede ser él mismo el grid/flex del consumer y los items sus celdas.
 *
 * El contenido se renderiza oculto desde el primer paint (sin flash) pero
 * presente en el DOM (SEO, lectores). Con reduced motion o sin
 * IntersectionObserver se muestra directo.
 */
export function ScrollReveal({
  direction = 'up',
  distance,
  duration,
  stagger,
  threshold = 0.15,
  once = true,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: ScrollRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { threshold, once })
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('scroll-reveal'), revealCss())
  }, [])

  return (
    <div
      ref={rootRef}
      className={`aui-reveal${className ? ` ${className}` : ''}`}
      data-aui-dir={direction}
      data-aui-visible={inView ? '' : undefined}
      data-aui-static={isStatic ? '' : undefined}
      style={{ ...revealVars({ distance, duration, stagger }), ...style }}
      {...rest}
    >
      {Children.toArray(children).map((child, i) => (
        <div
          key={i}
          className="aui-reveal-item"
          style={{ '--aui-reveal-i': i } as CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
