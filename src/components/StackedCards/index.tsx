'use client'
import { Children, useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { subscribeScroll } from '../../utils/scroll-driver'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { stackDepth, stackScrolled } from './progress'
import type { StackedCardsProps } from './types'

export type { StackedCardsProps } from './types'

// El apilado físico lo da `position: sticky; top: offset` en cada wrapper (el
// navegador hace el pin gratis). Cada wrapper reserva `--aui-stack-travel` px
// de recorrido. La escala/opacidad por profundidad se interpola en el
// compositor a partir de --aui-stack-depth (lo escribe el scroll-driver).
const CSS = `
.aui-stack-item {
  position: sticky;
  top: var(--aui-stack-offset, 0px);
  height: var(--aui-stack-travel, 400px);
}
.aui-stack-card {
  height: 100%;
  transform-origin: top center;
  transform: scale(calc(1 - var(--aui-stack-scale-step, 0.05) * var(--aui-stack-depth, 0)));
  opacity: calc(1 - var(--aui-stack-opacity-step, 0) * var(--aui-stack-depth, 0));
}
`

/**
 * Apila sus hijos directos durante el scroll: cada card se envuelve en un
 * wrapper `position: sticky` que se fija a `offsetTop` y se va apilando sobre
 * la anterior (la más reciente arriba). Las cards tapadas se encogen y/o
 * oscurecen según cuántas tienen encima.
 *
 * El scroll-driver (`subscribeScroll` + RAF) calcula la profundidad por card y
 * la escribe como `--aui-stack-depth` sin re-renderizar React por frame; el
 * tracking solo corre cuando el contenedor está cerca del viewport
 * (`useInView`). Con reduced motion el tracking se apaga y las cards quedan en
 * un layout sticky estático y legible.
 */
export function StackedCards({
  offsetTop,
  scaleStep,
  opacityStep,
  cardTravel,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: StackedCardsProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  const inView = useInView(rootRef, { once: false, threshold: 0 })
  const cards = Children.toArray(children)
  const nCards = cards.length

  useEffect(() => {
    injectStyles(styleId('stacked-cards'), CSS)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || nCards === 0 || isStatic || !inView) return

    const items = root.querySelectorAll<HTMLElement>('.aui-stack-item')
    const travel = cardTravel ?? 400
    const offset = offsetTop ?? 0

    return subscribeScroll(() => {
      const scrolled = stackScrolled(root.getBoundingClientRect().top, offset)
      items.forEach((item, i) => {
        item.style.setProperty('--aui-stack-depth', String(stackDepth(scrolled, travel, i, nCards)))
      })
    })
  }, [nCards, isStatic, inView, cardTravel, offsetTop])

  const rootStyle: CSSProperties = {
    ...(offsetTop !== undefined ? { '--aui-stack-offset': `${offsetTop}px` } : null),
    ...(scaleStep !== undefined ? { '--aui-stack-scale-step': scaleStep } : null),
    ...(opacityStep !== undefined ? { '--aui-stack-opacity-step': opacityStep } : null),
    ...(cardTravel !== undefined ? { '--aui-stack-travel': `${cardTravel}px` } : null),
    ...style,
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={`aui-stack${className ? ` ${className}` : ''}`}
      style={rootStyle}
      {...rest}
    >
      {cards.map((card, i) => (
        <div key={i} className="aui-stack-item" style={{ '--aui-stack-i': i } as CSSProperties}>
          <div className="aui-stack-card">{card}</div>
        </div>
      ))}
    </div>
  )
}
