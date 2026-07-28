'use client'
import { useEffect, type CSSProperties, type ElementType } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { buildGlitchCss } from './glitch-css'
import { glitchTextCss } from './styles'
import type { GlitchTextProps } from './types'

export type { GlitchTextProps, GlitchTrigger } from './types'

export interface GlitchTextConfig {
  frequency?: number
  burstDuration?: number
}

// Las capas desplazadas son ::before/::after con `content: attr(data-text)`:
// no existen en el árbol de accesibilidad, así el texto se lee una sola vez.
// Los keyframes de las ráfagas se inyectan aparte por configuración (ver
// glitch-css.ts). Reduced motion: `loop` queda estático; `hover` conserva un
// split estático atenuado sin jitter (respuesta a input directo).

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

  // El ciclo dura GLITCH_CYCLE_S: las ráfagas se expresan como fracción.
  const burstFraction = burstDuration / 3
  const key = `f${Math.max(1, Math.floor(frequency))}-b${Math.round(burstFraction * 100)}`

  useEffect(() => {
    injectStyles(styleId('glitch-text'), glitchTextCss())
    injectStyles(styleId(`glitch-text-${key}`), buildGlitchCss(key, frequency, burstFraction))
  }, [key, frequency, burstFraction])

  return (
    <Tag
      className={`aui-glitch${className ? ` ${className}` : ''}`}
      data-text={children}
      data-aui-glitch={key}
      data-aui-trigger={trigger}
      data-aui-motion={respectReducedMotion ? undefined : ''}
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

/**
 * Registra el CSS base y el de las ráfagas con cadencia para usar GlitchText en modo clase,
 * sin montar el componente. Inyecta los estilos una sola vez de forma idempotente.
 */
export function registerGlitchText(config?: GlitchTextConfig): void {
  const frequency = config?.frequency ?? 1
  const burstDuration = config?.burstDuration ?? 0.3
  const burstFraction = burstDuration / 3
  const key = `f${Math.max(1, Math.floor(frequency))}-b${Math.round(burstFraction * 100)}`

  injectStyles(styleId('glitch-text'), glitchTextCss())
  injectStyles(styleId(`glitch-text-${key}`), buildGlitchCss(key, frequency, burstFraction))
}
