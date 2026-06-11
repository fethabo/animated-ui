'use client'
import { useEffect } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { shinyCss, shinyVars } from './styles'
import type { ShinyTextProps } from './types'

export type { ShinyTextProps } from './types'

/**
 * Texto con un brillo que lo barre en loop. CSS puro: cero JS por frame.
 *
 * Con colores custom de base y brillo cubre también el caso de texto con
 * gradiente animado. Renderiza un `<span>`: la semántica la pone el consumer
 * envolviéndolo (`<h1><ShinyText>…</ShinyText></h1>`).
 */
export function ShinyText({
  color,
  highlight,
  speed,
  angle,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: ShinyTextProps) {
  const reducedMotion = useReducedMotion()
  const loopActive = !(respectReducedMotion && reducedMotion)

  useEffect(() => {
    injectStyles(styleId('shiny-text'), shinyCss())
  }, [])

  return (
    <span
      className={`aui-shiny${className ? ` ${className}` : ''}`}
      data-aui-loop={loopActive ? '' : undefined}
      style={{ ...shinyVars({ color, highlight, speed, angle }), ...style }}
      {...rest}
    >
      {children}
    </span>
  )
}
