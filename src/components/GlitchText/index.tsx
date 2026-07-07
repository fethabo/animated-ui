'use client'
import { useEffect, type CSSProperties, type ElementType } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { buildGlitchCss } from './glitch-css'
import type { GlitchTextProps } from './types'

export type { GlitchTextProps, GlitchTrigger } from './types'

// Las capas desplazadas son ::before/::after con `content: attr(data-text)`:
// no existen en el árbol de accesibilidad, así el texto se lee una sola vez.
// Los keyframes de las ráfagas se inyectan aparte por configuración (ver
// glitch-css.ts). Reduced motion: `loop` queda estático; `hover` conserva un
// split estático atenuado sin jitter (respuesta a input directo).
const BASE_CSS = `
.aui-glitch {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}
.aui-glitch::before,
.aui-glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
}
.aui-glitch::before {
  color: var(--aui-glitch-color-1, #ff004d);
}
.aui-glitch::after {
  color: var(--aui-glitch-color-2, #00fff9);
}
.aui-glitch[data-aui-static][data-aui-trigger='hover']:hover::before {
  opacity: 0.55;
  transform: translateX(calc(-1 * var(--aui-glitch-intensity, 3px)));
}
.aui-glitch[data-aui-static][data-aui-trigger='hover']:hover::after {
  opacity: 0.55;
  transform: translateX(var(--aui-glitch-intensity, 3px));
}
`

/**
 * Texto con glitch RGB-split intermitente, CSS puro (sin JS por frame): dos
 * capas del mismo texto (pseudo-elementos, colores rojo/cyan por default)
 * desplazadas y recortadas con `clip-path` animado, en ráfagas breves
 * separadas por períodos estables. `trigger="hover"` lo activa solo con el
 * cursor encima.
 *
 * Acepta **solo texto plano** (la duplicación usa `attr(data-text)`) y está
 * pensado para titulares — el `clip-path` animado sobre párrafos largos
 * cuesta pintado. Con `prefers-reduced-motion`, `loop` queda estático y
 * `hover` muestra un split estático atenuado.
 */
export function GlitchText({
  children,
  as,
  trigger = 'loop',
  colors = ['#ff004d', '#00fff9'],
  intensity = 3,
  frequency = 1,
  burstDuration = 0.3,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: GlitchTextProps) {
  const Tag: ElementType = as ?? 'span'
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  // El ciclo dura GLITCH_CYCLE_S: las ráfagas se expresan como fracción.
  const burstFraction = burstDuration / 3
  const key = `f${Math.max(1, Math.floor(frequency))}-b${Math.round(burstFraction * 100)}`

  useEffect(() => {
    injectStyles(styleId('glitch-text'), BASE_CSS)
    injectStyles(styleId(`glitch-text-${key}`), buildGlitchCss(key, frequency, burstFraction))
  }, [key, frequency, burstFraction])

  return (
    <Tag
      className={`aui-glitch${className ? ` ${className}` : ''}`}
      data-text={children}
      data-aui-glitch={key}
      data-aui-trigger={trigger}
      data-aui-static={isStatic ? '' : undefined}
      style={
        {
          '--aui-glitch-color-1': colors[0],
          '--aui-glitch-color-2': colors[1],
          '--aui-glitch-intensity': `${intensity}px`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  )
}
