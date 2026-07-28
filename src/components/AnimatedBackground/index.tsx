'use client'
import { useEffect } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { aurora } from './variants/aurora'
import { mesh } from './variants/mesh'
import { noise } from './variants/noise'
import { beam } from './variants/beam'
import { lava } from './variants/lava'
import { grid } from './variants/grid'
import { rays } from './variants/rays'
import { dots } from './variants/dots'
import { bubbles } from './variants/bubbles'
import { animatedBackgroundCss } from './styles'
import type {
  AnimatedBackgroundProps,
  AnimatedBackgroundVariant,
  AnimatedBackgroundVariantName,
} from './types'

export type { AnimatedBackgroundProps, AnimatedBackgroundVariantName } from './types'

export const VARIANTS: Record<AnimatedBackgroundVariantName, AnimatedBackgroundVariant> = {
  aurora,
  mesh,
  noise,
  beam,
  lava,
  grid,
  rays,
  dots,
  bubbles,
}

// CSS base compartido por todas las variantes. La regla [data-aui-static]
// apaga las animaciones (incluidas las de pseudo-elementos) cuando el
// componente decide respetar prefers-reduced-motion.

/**
 * Background animado con CSS puro (sin JS por frame).
 *
 * Se posiciona `absolute, inset: 0` — colocalo dentro de un contenedor con
 * `position: relative`, o pasá `fixed` para cubrir el viewport. Los estilos
 * se inyectan solos al montar; no requiere imports de CSS.
 */
export function AnimatedBackground({
  variant = 'aurora',
  colors,
  speed,
  intensity,
  fixed = false,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: AnimatedBackgroundProps) {
  const definition = VARIANTS[variant]

  useEffect(() => {
    injectStyles(styleId('animated-background'), animatedBackgroundCss())
    injectStyles(styleId(`animated-background-${definition.name}`), definition.css)
  }, [definition])

  return (
    <div
      aria-hidden="true"
      className={`aui-bg aui-${variant}${className ? ` ${className}` : ''}`}
      data-aui-motion={respectReducedMotion ? undefined : ''}
      style={{
        ...(fixed ? { position: 'fixed' as const } : null),
        ...definition.cssVars({ colors, speed, intensity }),
        ...style,
      }}
      {...rest}
    />
  )
}

/**
 * Registra el CSS base y el de una variante para usar AnimatedBackground en modo clase,
 * sin montar el componente. Inyecta los estilos una sola vez de forma idempotente.
 */
export function registerAnimatedBackground(variant: AnimatedBackgroundVariantName = 'aurora'): void {
  const definition = VARIANTS[variant]
  injectStyles(styleId('animated-background'), animatedBackgroundCss())
  injectStyles(styleId(`animated-background-${definition.name}`), definition.css)
}
