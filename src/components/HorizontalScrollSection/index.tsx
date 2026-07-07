'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { subscribeScroll } from '../../utils/scroll-driver'
import { hscrollProgress, travelDistance } from './progress'
import type { HorizontalScrollSectionProps } from './types'

export type { HorizontalScrollSectionProps } from './types'

// El desplazamiento se resuelve por CSS: la fila consume el progreso y el
// recorrido (vars escritas por el driver/observer) con un translateX
// compositado — sin React state ni estilos recalculados en el hot path.
const CSS = `
.aui-hscroll {
  position: relative;
}
.aui-hscroll-inner {
  position: sticky;
  top: 0;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.aui-hscroll-row {
  display: flex;
  width: max-content;
  will-change: transform;
  transform: translateX(calc(var(--aui-hscroll-progress, 0) * var(--aui-hscroll-travel, 0px) * -1));
}
/* Reduced motion: paneles apilados verticalmente, sin sticky ni transform. */
.aui-hscroll[data-aui-static] {
  height: auto !important;
}
.aui-hscroll[data-aui-static] .aui-hscroll-inner {
  position: static;
  height: auto;
  overflow: visible;
  display: block;
}
.aui-hscroll[data-aui-static] .aui-hscroll-row {
  display: block;
  width: auto;
  transform: none;
}
`

/**
 * Sección cuyo contenido (una fila de paneles: los `children`) se desplaza
 * horizontalmente conducido por el scroll vertical: el root provee el
 * recorrido (altura = `100dvh` + recorrido horizontal × `speed`), un inner
 * `position: sticky` fija el viewport de la fila, y el scroll-driver escribe
 * `--aui-hscroll-progress` (0→1) en el root — disponible para efectos
 * derivados del consumer (patrón StickyScenes). El desplazamiento es un
 * `translateX(calc(...))` compositado, sin React state por frame.
 *
 * El recorrido se deriva del ancho real de la fila menos el viewport, medido
 * con observer (no por frame) y recalculado ante resizes. El scroll es
 * reversible. Con `prefers-reduced-motion` degrada a paneles apilados
 * verticalmente, alcanzables con scroll normal. Todo el contenido está en el
 * markup SSR.
 */
export function HorizontalScrollSection({
  speed = 1,
  easing,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: HorizontalScrollSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)

  const reducedMotion = useReducedMotion()
  const inView = useInView(rootRef, { once: false, threshold: 0 })
  const rowSize = useResizeObserver(rowRef)
  const innerSize = useResizeObserver(innerRef)
  const isStatic = respectReducedMotion && reducedMotion

  const travel = travelDistance(rowSize.width, innerSize.width)

  useEffect(() => {
    injectStyles(styleId('horizontal-scroll-section'), CSS)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || isStatic || !inView || travel <= 0) return

    return subscribeScroll(() => {
      const rect = root.getBoundingClientRect()
      const progress = hscrollProgress(rect.top, root.offsetHeight, window.innerHeight)
      root.style.setProperty('--aui-hscroll-progress', String(easing ? easing(progress) : progress))
    })
  }, [isStatic, inView, travel, easing])

  return (
    <div
      ref={rootRef}
      className={`aui-hscroll${className ? ` ${className}` : ''}`}
      data-aui-static={isStatic ? '' : undefined}
      style={
        {
          height: `calc(100dvh + ${Math.round(travel * speed)}px)`,
          '--aui-hscroll-progress': 0,
          '--aui-hscroll-travel': `${travel}px`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <div ref={innerRef} className="aui-hscroll-inner">
        <div ref={rowRef} className="aui-hscroll-row">
          {children}
        </div>
      </div>
    </div>
  )
}
