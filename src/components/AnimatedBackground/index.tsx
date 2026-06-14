'use client'
import { useEffect } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { aurora } from './variants/aurora'
import { mesh } from './variants/mesh'
import { noise } from './variants/noise'
import { beam } from './variants/beam'
import { lava } from './variants/lava'
import type {
  AnimatedBackgroundProps,
  AnimatedBackgroundVariant,
  AnimatedBackgroundVariantName,
} from './types'

export type { AnimatedBackgroundProps, AnimatedBackgroundVariantName } from './types'

const VARIANTS: Record<AnimatedBackgroundVariantName, AnimatedBackgroundVariant> = {
  aurora,
  mesh,
  noise,
  beam,
  lava,
}

// CSS base compartido por todas las variantes. La regla [data-aui-static]
// apaga las animaciones (incluidas las de pseudo-elementos) cuando el
// componente decide respetar prefers-reduced-motion.
const BASE_CSS = `
.aui-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-bg[data-aui-static],
.aui-bg[data-aui-static]::before,
.aui-bg[data-aui-static]::after {
  animation: none !important;
}
`

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
  const reducedMotion = useReducedMotion()
  const definition = VARIANTS[variant]

  useEffect(() => {
    injectStyles(styleId('animated-background'), BASE_CSS)
    injectStyles(styleId(`animated-background-${definition.name}`), definition.css)
  }, [definition])

  const isStatic = respectReducedMotion && reducedMotion

  return (
    <div
      aria-hidden="true"
      className={`aui-bg aui-${variant}${className ? ` ${className}` : ''}`}
      data-aui-static={isStatic ? '' : undefined}
      style={{
        ...(fixed ? { position: 'fixed' as const } : null),
        ...definition.cssVars({ colors, speed, intensity }),
        ...style,
      }}
      {...rest}
    />
  )
}
