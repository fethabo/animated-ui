'use client'
import { useEffect, useRef, type CSSProperties, type ElementType } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { subscribeScroll, viewportProgress } from '../../utils/scroll-driver'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { splitText } from '../../utils/split-text'
import { revealProgress } from './progress'
import type { TextScrollRevealProps } from './types'

export type { TextScrollRevealProps } from './types'

// El scroll-driver escribe una única var de progreso (0→1) en el root; cada
// palabra deriva su encendido con calc() a partir de su índice — cero JS por
// palabra por frame (misma arquitectura que ParallaxLayers/StackedCards). El
// término (progress * n - i) hace que la palabra i transicione de 0 a 1 en su
// ventana proporcional del progreso. Sin transition: el scroll ya es una
// entrada continua y reversible.
const CSS = `
.aui-text-scroll-word {
  --aui-text-scroll-t: clamp(0, calc(var(--aui-text-scroll-progress, 0) * var(--aui-text-scroll-n, 1) - var(--aui-text-scroll-i, 0)), 1);
  opacity: calc(var(--aui-text-scroll-from-opacity, 0.15) + (var(--aui-text-scroll-to-opacity, 1) - var(--aui-text-scroll-from-opacity, 0.15)) * var(--aui-text-scroll-t));
}
.aui-text-scroll-space {
  white-space: pre;
}
.aui-text-scroll[data-aui-colored] .aui-text-scroll-word {
  color: color-mix(
    in oklab,
    var(--aui-text-scroll-to-color, currentColor) calc(var(--aui-text-scroll-t) * 100%),
    var(--aui-text-scroll-from-color, currentColor)
  );
}
.aui-text-scroll[data-aui-static] .aui-text-scroll-word {
  opacity: var(--aui-text-scroll-to-opacity, 1);
}
.aui-text-scroll[data-aui-static][data-aui-colored] .aui-text-scroll-word {
  color: var(--aui-text-scroll-to-color, currentColor);
}
`

/**
 * Párrafo cuyas palabras pasan de apagadas a encendidas progresivamente según
 * el avance del scroll (highlight progresivo), en orden y reversible al
 * scrollear hacia atrás.
 *
 * El tracking solo corre con el contenedor cerca del viewport (`useInView`):
 * N párrafos fuera de pantalla cuestan cero por frame. Accesible: el texto
 * completo va en `aria-label` del root y las palabras son `aria-hidden`
 * (patrón de split del paquete). Con reduced motion el texto se muestra
 * completamente encendido y estático, sin tracking.
 */
export function TextScrollReveal({
  children,
  as,
  fromOpacity,
  toOpacity,
  fromColor,
  toColor,
  offset = [0.2, 0.6],
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: TextScrollRevealProps) {
  const Tag: ElementType = as ?? 'p'
  const rootRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  const inView = useInView(rootRef, { once: false, rootMargin: '100px', threshold: 0 })
  const active = inView && !isStatic
  const [offsetStart, offsetEnd] = offset

  useEffect(() => {
    injectStyles(styleId('text-scroll-reveal'), CSS)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !active) return
    return subscribeScroll(() => {
      const rect = root.getBoundingClientRect()
      const viewport = viewportProgress(rect.top, rect.height, window.innerHeight)
      root.style.setProperty(
        '--aui-text-scroll-progress',
        String(revealProgress(viewport, [offsetStart, offsetEnd])),
      )
    })
  }, [active, offsetStart, offsetEnd])

  const units = splitText(children, 'word')
  const wordCount = units.filter((unit) => !unit.isSpace).length
  let wordIndex = 0

  const rootStyle: CSSProperties = {
    '--aui-text-scroll-n': wordCount || 1,
    ...(fromOpacity !== undefined ? { '--aui-text-scroll-from-opacity': fromOpacity } : null),
    ...(toOpacity !== undefined ? { '--aui-text-scroll-to-opacity': toOpacity } : null),
    ...(fromColor !== undefined ? { '--aui-text-scroll-from-color': fromColor } : null),
    ...(toColor !== undefined ? { '--aui-text-scroll-to-color': toColor } : null),
    ...style,
  } as CSSProperties

  return (
    <Tag
      ref={rootRef}
      aria-label={children}
      className={`aui-text-scroll${className ? ` ${className}` : ''}`}
      data-aui-static={isStatic ? '' : undefined}
      data-aui-colored={fromColor !== undefined || toColor !== undefined ? '' : undefined}
      style={rootStyle}
      {...rest}
    >
      {units.map((unit, i) =>
        unit.isSpace ? (
          <span key={i} className="aui-text-scroll-space" aria-hidden="true">
            {unit.text}
          </span>
        ) : (
          <span
            key={i}
            className="aui-text-scroll-word"
            aria-hidden="true"
            style={{ '--aui-text-scroll-i': wordIndex++ } as CSSProperties}
          >
            {unit.text}
          </span>
        ),
      )}
    </Tag>
  )
}
