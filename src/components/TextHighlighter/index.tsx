'use client'
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useInView } from '../../hooks/useInView'
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { handDrawnShapes } from '../../utils/hand-drawn'
import { clearStroke, prepareStroke, svgStrokeCss, SVG_STROKE_STYLE_ID } from '../../utils/svg-stroke'
import { highlighterCss, highlighterVars } from './styles'
import type { TextHighlighterProps } from './types'

export type { HighlighterShape, HighlighterTrigger, TextHighlighterProps } from './types'

/**
 * Marcador a mano alzada sobre texto inline: subraya, resalta, encierra,
 * tacha o recuadra el contenido envuelto con un trazo procedural seedable
 * que se "dibuja" (line-drawing por dash, cero JS por frame) al dispararse.
 *
 * El texto queda intacto (seleccionable, legible por lectores): el SVG es un
 * overlay absoluto `aria-hidden` sin eventos, dimensionado por
 * `useResizeObserver` — el path se regenera con la misma seed al cambiar el
 * tamaño (e.g. re-wrapping). El shape se dibuja sobre el bounding box
 * completo del span: para texto multi-línea conviene aplicarlo a frases
 * cortas. En SSR se sirve solo el texto; con reduced motion el shape aparece
 * completo, sin animación.
 */
export function TextHighlighter({
  children,
  shape = 'underline',
  color,
  strokeWidth,
  duration,
  delay,
  trigger = 'in-view',
  once = true,
  seed,
  respectReducedMotion = true,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: TextHighlighterProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion
  const autoSeed = useId()

  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { width, height } = useResizeObserver(rootRef)
  const inView = useInView(rootRef, { once })

  useEffect(() => {
    injectStyles(SVG_STROKE_STYLE_ID, svgStrokeCss())
    injectStyles(styleId('text-highlighter'), highlighterCss())
    setMounted(true)
  }, [])

  // El path se genera recién con el tamaño real medido (post-montaje) y se
  // regenera con la misma seed en cada resize.
  const d = useMemo(() => {
    if (width < 1 || height < 1) return null
    return handDrawnShapes[shape](width, height, seed ?? autoSeed)
  }, [shape, width, height, seed, autoSeed])

  // Rebobinado: enrollar el trazo antes del paint, para que el path recién
  // generado nunca se vea completo antes de dibujarse.
  useIsomorphicLayoutEffect(() => {
    const path = pathRef.current
    if (!path || !d || isStatic) return
    prepareStroke(path)
    return () => clearStroke(path)
  }, [d, isStatic])

  const drawn = trigger === 'hover' ? hovered : trigger === 'mount' ? mounted : inView

  const handleEnter = (event: MouseEvent<HTMLSpanElement>) => {
    onMouseEnter?.(event)
    if (trigger === 'hover') setHovered(true)
  }
  const handleLeave = (event: MouseEvent<HTMLSpanElement>) => {
    onMouseLeave?.(event)
    if (trigger === 'hover' && !once) setHovered(false)
  }

  return (
    <span
      ref={rootRef}
      className={`aui-highlighter${className ? ` ${className}` : ''}`}
      data-aui-shape={shape}
      data-aui-drawn={drawn ? '' : undefined}
      data-aui-static={isStatic ? '' : undefined}
      style={{ ...highlighterVars({ color, strokeWidth, duration, delay }), ...style }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
      {mounted && d && (
        <svg
          className="aui-highlighter-svg"
          aria-hidden="true"
          focusable="false"
          viewBox={`0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`}
          preserveAspectRatio="none"
        >
          <path ref={pathRef} className="aui-highlighter-path" d={d} />
        </svg>
      )}
    </span>
  )
}
