'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { RotatingTextProps } from './types'

export type { RotatingTextProps, RotatingTransition } from './types'

// El box de la palabra transiciona su ancho (medido por ref al cambiar de
// palabra, no por frame) para que el contenido circundante no salte. El
// measurer es una copia invisible que define el ancho natural de la palabra
// actual. Los presets animan solo la entrada de la palabra nueva.
const CSS = `
.aui-rotating-box {
  display: inline-block;
  position: relative;
  vertical-align: bottom;
  white-space: nowrap;
  color: var(--aui-rotating-color, inherit);
  transition: width var(--aui-rotating-duration, 0.4s) ease;
  perspective: 400px;
}
.aui-rotating-box[data-aui-transition='slide-up'] {
  overflow: hidden;
}
.aui-rotating-word {
  display: inline-block;
  white-space: nowrap;
}
.aui-rotating-measurer {
  position: absolute;
  left: 0;
  top: 0;
  visibility: hidden;
  pointer-events: none;
  white-space: nowrap;
}
.aui-rotating-box[data-aui-transition='fade'] > .aui-rotating-word {
  animation: aui-rotating-fade var(--aui-rotating-duration, 0.4s) ease;
}
.aui-rotating-box[data-aui-transition='slide-up'] > .aui-rotating-word {
  animation: aui-rotating-slide-up var(--aui-rotating-duration, 0.4s) ease;
}
.aui-rotating-box[data-aui-transition='flip'] > .aui-rotating-word {
  animation: aui-rotating-flip var(--aui-rotating-duration, 0.4s) ease;
  transform-origin: 50% 100%;
}
.aui-rotating[data-aui-static] .aui-rotating-word {
  animation: none !important;
}
@keyframes aui-rotating-fade {
  from { opacity: 0; }
}
@keyframes aui-rotating-slide-up {
  from { opacity: 0; transform: translateY(0.9em); }
}
@keyframes aui-rotating-flip {
  from { opacity: 0; transform: rotateX(90deg); }
}
`

/**
 * Texto base opcional + una palabra rotante que cicla por `words` con una
 * transición animada (`fade`/`slide-up`/`flip`): "Hacemos *webs* / *apps* /
 * *magia*". El avance usa timers encadenados (sin RAF) y la transición es CSS
 * inyectado. El ancho del box transiciona suavemente entre palabras de largos
 * distintos (medición por ref al cambiar, no por frame) — un `width` fijo via
 * CSS sobre `.aui-rotating-box` elimina incluso ese ajuste.
 *
 * Accesible sin spam: el root expone un `aria-label` estático (texto base +
 * lista de palabras) y la palabra animada es `aria-hidden` — sin `aria-live`.
 * Con `prefers-reduced-motion` muestra la primera palabra estática.
 */
export function RotatingText({
  words,
  transition = 'slide-up',
  interval = 2200,
  duration = 0.4,
  color,
  loop = true,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: RotatingTextProps) {
  const boxRef = useRef<HTMLSpanElement>(null)
  const measurerRef = useRef<HTMLSpanElement>(null)
  const [index, setIndex] = useState(0)

  const reducedMotion = useReducedMotion()
  const active = !(respectReducedMotion && reducedMotion)
  const displayIndex = active ? Math.min(index, Math.max(0, words.length - 1)) : 0
  const word = words[displayIndex] ?? ''

  useEffect(() => {
    injectStyles(styleId('rotating-text'), CSS)
  }, [])

  // Avance por timer encadenado: cada palabra permanece `interval` ms. Con
  // `loop=false` el timer no se reprograma al llegar a la última.
  useEffect(() => {
    if (!active || words.length <= 1) return
    if (!loop && index >= words.length - 1) return
    const id = setTimeout(() => {
      setIndex((i) => (loop ? (i + 1) % words.length : Math.min(i + 1, words.length - 1)))
    }, interval)
    return () => clearTimeout(id)
  }, [index, active, loop, interval, words.length])

  // Layout estable: al cambiar la palabra se mide el measurer (una vez, no
  // por frame) y el box transiciona hacia el ancho nuevo.
  useEffect(() => {
    const box = boxRef.current
    const measurer = measurerRef.current
    if (!box || !measurer) return
    box.style.width = `${measurer.offsetWidth}px`
  }, [word])

  const base = typeof children === 'string' ? children : ''
  const ariaLabel = `${base}${words.join(', ')}`

  return (
    <span
      className={`aui-rotating${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
      data-aui-static={active ? undefined : ''}
      style={
        {
          ...(color !== undefined ? { '--aui-rotating-color': color } : null),
          '--aui-rotating-duration': `${duration}s`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
      <span ref={boxRef} className="aui-rotating-box" aria-hidden="true" data-aui-transition={transition}>
        {/* key por índice: cada palabra nueva re-monta el nodo y re-dispara la animación de entrada */}
        <span key={displayIndex} className="aui-rotating-word">
          {word}
        </span>
        <span ref={measurerRef} className="aui-rotating-measurer">
          {word}
        </span>
      </span>
    </span>
  )
}
