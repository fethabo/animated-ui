'use client'
import { useEffect } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
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
  useEffect(() => {
    injectStyles(styleId('shiny-text'), shinyCss())
  }, [])

  return (
    <span
      className={`aui-shiny${className ? ` ${className}` : ''}`}
      data-aui-motion={respectReducedMotion ? undefined : ''}
      style={{ ...shinyVars({ color, highlight, speed, angle }), ...style }}
      {...rest}
    >
      {children}
    </span>
  )
}

/**
 * Registra el CSS de ShinyText para usarlo en modo clase, sin montar el componente.
 * Inyecta los estilos una sola vez en el <head> de forma idempotente.
 */
export function registerShinyText(): void {
  injectStyles(styleId('shiny-text'), shinyCss())
}
