'use client'
import { useEffect, type CSSProperties, type ElementType } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { splitText } from '../../utils/split-text'
import type { WavyTextProps } from './types'

export type { WavyTextProps } from './types'

// Solo `transform: translateY` (compositado): la ondulación no altera la
// métrica de línea del texto circundante. El delay negativo por índice hace
// que la ola ya esté en curso al montar (sin rampa inicial). Los espacios se
// preservan como spans `white-space: pre` sin animación.
const CSS = `
.aui-wavy {
  display: inline-block;
}
.aui-wavy-char {
  display: inline-block;
  animation: aui-wavy-bob var(--aui-wavy-speed, 1.6s) ease-in-out infinite;
  animation-delay: calc(-1 * var(--aui-wavy-stagger, 0.06s) * var(--aui-wavy-i, 0));
  will-change: transform;
}
.aui-wavy-space {
  white-space: pre;
}
.aui-wavy[data-aui-static] .aui-wavy-char {
  animation: none;
}
@keyframes aui-wavy-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(-1 * var(--aui-wavy-amplitude, 6px))); }
}
`

/**
 * Texto cuyos caracteres ondulan en loop continuo formando una ola que lo
 * recorre — CSS puro (keyframes + `animation-delay` escalonado por índice,
 * seteado inline una sola vez en render), sin JavaScript por frame. Anima
 * únicamente `transform: translateY` (compositado): la línea circundante no
 * se mueve.
 *
 * Accesible: el texto completo va en `aria-label` del root y los caracteres
 * particionados son `aria-hidden` (patrón de split del paquete); los espacios
 * se preservan sin colapsar. Con `prefers-reduced-motion` el texto queda
 * estático en su línea base.
 */
export function WavyText({
  children,
  as,
  amplitude = 6,
  speed = 1.6,
  stagger = 0.06,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: WavyTextProps) {
  const Tag: ElementType = as ?? 'span'
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('wavy-text'), CSS)
  }, [])

  const units = splitText(children, 'char')
  let animatedIndex = 0

  return (
    <Tag
      className={`aui-wavy${className ? ` ${className}` : ''}`}
      aria-label={children}
      data-aui-static={isStatic ? '' : undefined}
      style={
        {
          '--aui-wavy-amplitude': `${amplitude}px`,
          '--aui-wavy-speed': `${speed}s`,
          '--aui-wavy-stagger': `${stagger}s`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {units.map((unit, i) =>
        unit.isSpace ? (
          <span key={i} className="aui-wavy-space" aria-hidden="true">
            {unit.text}
          </span>
        ) : (
          <span
            key={i}
            className="aui-wavy-char"
            aria-hidden="true"
            style={{ '--aui-wavy-i': animatedIndex++ } as CSSProperties}
          >
            {unit.text}
          </span>
        ),
      )}
    </Tag>
  )
}
