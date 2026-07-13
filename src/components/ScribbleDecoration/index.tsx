'use client'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useInView } from '../../hooks/useInView'
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { clearStroke, prepareStroke, svgStrokeCss, SVG_STROKE_STYLE_ID } from '../../utils/svg-stroke'
import { scribbleShapes } from './shapes'
import { scribbleCss, scribbleVars } from './styles'
import type { ScribbleDecorationProps } from './types'

export type { ScribbleShape, ScribbleShapeName, ScribbleSize } from './shapes'
export type { ScribbleDecorationProps, ScribbleTrigger } from './types'

/**
 * Garabato decorativo a mano alzada (flecha, asterisco, espiral, subrayado,
 * círculo — o una shape custom por función) generado proceduralmente con
 * jitter seedable y "dibujado" por line-drawing (cero JS por frame) al entrar
 * al viewport o al montar. Con `repeat`, se dibuja, desvanece y redibuja en
 * loop.
 *
 * El SVG es decoración pura: `aria-hidden`, sin eventos, dimensionado por su
 * contenedor (tamaño default pisable via `--aui-scribble-width/height` o
 * estilos del consumer) y regenerado con la misma seed en cada resize. En SSR
 * se sirve solo el contenedor; con reduced motion el garabato aparece
 * completo y estático.
 */
export function ScribbleDecoration({
  shape = 'arrow',
  color,
  strokeWidth,
  duration,
  delay,
  trigger = 'in-view',
  once = true,
  repeat = false,
  seed,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: ScribbleDecorationProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion
  const autoSeed = useId()

  const [mounted, setMounted] = useState(false)
  const { width, height } = useResizeObserver(rootRef)
  const inView = useInView(rootRef, { once })

  useEffect(() => {
    injectStyles(SVG_STROKE_STYLE_ID, svgStrokeCss())
    injectStyles(styleId('scribble-decoration'), scribbleCss())
    setMounted(true)
  }, [])

  // El path se genera recién con el tamaño real medido (post-montaje) y se
  // regenera con la misma seed en cada resize. `shape` acepta un nombre
  // builtin o una función del consumer con el mismo contrato.
  const d = useMemo(() => {
    if (width < 1 || height < 1) return null
    const shapeFn = typeof shape === 'function' ? shape : scribbleShapes[shape]
    return shapeFn({ width, height }, seed ?? autoSeed)
  }, [shape, width, height, seed, autoSeed])

  // Rebobinado: enrollar el trazo antes del paint, para que el path recién
  // generado nunca se vea completo antes de dibujarse.
  useIsomorphicLayoutEffect(() => {
    const path = pathRef.current
    if (!path || !d || isStatic) return
    prepareStroke(path)
    return () => clearStroke(path)
  }, [d, isStatic])

  const drawn = trigger === 'mount' ? mounted : inView

  return (
    <span
      ref={rootRef}
      className={`aui-scribble${className ? ` ${className}` : ''}`}
      data-aui-drawn={drawn ? '' : undefined}
      data-aui-repeat={repeat && !isStatic ? '' : undefined}
      data-aui-static={isStatic ? '' : undefined}
      style={{ ...scribbleVars({ color, strokeWidth, duration, delay }), ...style }}
      {...rest}
    >
      {mounted && d && (
        <svg
          className="aui-scribble-svg"
          aria-hidden="true"
          focusable="false"
          viewBox={`0 0 ${Math.max(width, 1)} ${Math.max(height, 1)}`}
          preserveAspectRatio="none"
        >
          <path ref={pathRef} className="aui-scribble-path" d={d} />
        </svg>
      )}
    </span>
  )
}
