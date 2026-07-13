'use client'
import { useEffect, useRef, useState } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useInView } from '../../hooks/useInView'
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import {
  clearStroke,
  prepareStroke,
  svgStrokeCss,
  DRAWABLE_SELECTOR,
  SVG_STROKE_STYLE_ID,
} from '../../utils/svg-stroke'
import { drawPathCss, drawPathVars } from './styles'
import type { DrawPathProps } from './types'

export type { DrawPathProps, DrawPathTrigger } from './types'

/**
 * "Dibuja" trazo a trazo cualquier SVG provisto por el consumer (line-drawing
 * por dash, cero JS por frame) al entrar al viewport o al montar. El SVG no
 * se reestructura: se miden sus elementos con trazo (`path`, `line`,
 * `polyline`, `circle`, `rect`, `ellipse`), se los enrolla antes del primer
 * paint del cliente y se los anima con stagger por orden documental,
 * respetando `stroke`/`stroke-width` existentes.
 *
 * Los elementos con `data-aui-no-draw` (o dentro de un grupo que lo tenga) y
 * los que no exponen `getTotalLength()` quedan visibles sin animar. En SSR el
 * SVG se sirve completo y visible (SEO/no-JS); el rebobinado post-hidratación
 * puede producir un flash breve. Con reduced motion se muestra completo
 * directo. Los trazos de los SVGs que se monten después del primer render no
 * se re-escanean.
 */
export function DrawPath({
  children,
  duration,
  stagger,
  delay,
  trigger = 'in-view',
  once = true,
  threshold = 0.15,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: DrawPathProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  const [mounted, setMounted] = useState(false)
  const inView = useInView(rootRef, { threshold, once })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Rebobinado: enrollar cada trazo del consumer antes del primer paint del
  // cliente (el markup SSR se sirve completo y visible). El CSS se inyecta
  // acá y no en el useEffect pasivo: la clase `.aui-stroke` no debe llegar a
  // pintarse sin sus reglas de dash.
  useIsomorphicLayoutEffect(() => {
    injectStyles(SVG_STROKE_STYLE_ID, svgStrokeCss())
    injectStyles(styleId('draw-path'), drawPathCss())
    if (isStatic) return
    const root = rootRef.current
    if (!root) return
    const prepared: SVGElement[] = []
    let index = 0
    for (const el of Array.from(root.querySelectorAll<SVGElement>(DRAWABLE_SELECTOR))) {
      if (el.closest('[data-aui-no-draw]')) continue
      if (prepareStroke(el, index)) {
        prepared.push(el)
        index++
      }
    }
    return () => prepared.forEach(clearStroke)
  }, [isStatic])

  const drawn = trigger === 'mount' ? mounted : inView

  return (
    <div
      ref={rootRef}
      className={`aui-draw${className ? ` ${className}` : ''}`}
      data-aui-drawn={drawn ? '' : undefined}
      data-aui-static={isStatic ? '' : undefined}
      style={{ ...drawPathVars({ duration, stagger, delay }), ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}
