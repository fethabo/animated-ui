'use client'
import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { magnifyScale } from './magnify'
import type { DockItemProps, DockProps } from './types'

export type { DockItemProps, DockOrientation, DockProps } from './types'

// Los ítems escalan con la propiedad independiente `scale` (no pisa el
// `transform` del consumer) + una transition en el compositor: el retorno al
// salir el cursor es la misma transition, sin WAAPI por ítem. El origen del
// escalado ancla los ítems al borde del dock (crecen "hacia afuera", como el
// dock de macOS).
const CSS = `
.aui-dock {
  display: flex;
  align-items: flex-end;
  gap: var(--aui-dock-gap, 8px);
  width: max-content;
}
.aui-dock[data-aui-orientation='vertical'] {
  flex-direction: column;
  align-items: flex-start;
}
.aui-dock-item {
  scale: 1;
  transition: scale var(--aui-dock-return, 0.25s) ease-out;
  will-change: scale;
  transform-origin: 50% 100%;
}
.aui-dock[data-aui-orientation='vertical'] > .aui-dock-item {
  transform-origin: 0% 50%;
}
`

/**
 * Ítem del Dock. Envolvé acá cada ícono/botón; el contenedor le aplica la
 * escala por proximidad. Completamente interactivo: clicks, foco y orden de
 * tabulación quedan intactos.
 */
function DockItem({ children, className, style, ...rest }: DockItemProps) {
  return (
    <div
      className={`aui-dock-item${className ? ` ${className}` : ''}`}
      data-aui-dock-item=""
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * Fila de ítems que se magnifican según la proximidad del cursor (efecto dock
 * de macOS), generalizando el patrón de MagneticElement a N hijos. Cada
 * `mousemove` calcula por ítem una campana `cos` sobre la distancia al cursor
 * en el eje del dock (`magnifyScale`, módulo puro) y escribe `scale` directo
 * al style — por refs, sin re-renders de React por frame. Al salir el cursor,
 * la transition CSS devuelve todos los ítems a escala base.
 *
 * En dispositivos táctiles (sin cursor) queda como fila estática funcional.
 * Con `prefers-reduced-motion` la magnificación se desactiva. Los ítems
 * permanecen interactivos: la magnificación no intercepta eventos ni altera
 * el orden de tabulación.
 */
export function Dock({
  magnification = 1.5,
  radius = 120,
  gap = 8,
  orientation = 'horizontal',
  returnDuration = 0.25,
  respectReducedMotion = true,
  children,
  className,
  style,
  onMouseMove,
  onMouseLeave,
  ...rest
}: DockProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const active = !(respectReducedMotion && reducedMotion)

  useEffect(() => {
    injectStyles(styleId('dock'), CSS)
  }, [])

  const resetScales = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    root.querySelectorAll<HTMLElement>('[data-aui-dock-item]').forEach((item) => {
      item.style.scale = ''
    })
  }, [])

  // Si la preferencia de reduced motion se activa en vivo, vuelve a base.
  useEffect(() => {
    if (!active) resetScales()
  }, [active, resetScales])

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const root = rootRef.current
      if (root && active) {
        const vertical = orientation === 'vertical'
        const cursor = vertical ? event.clientY : event.clientX
        root.querySelectorAll<HTMLElement>('[data-aui-dock-item]').forEach((item) => {
          const rect = item.getBoundingClientRect()
          const center = vertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2
          const scale = magnifyScale(cursor - center, radius, magnification)
          item.style.scale = scale === 1 ? '' : String(scale)
        })
      }
      onMouseMove?.(event)
    },
    [active, orientation, radius, magnification, onMouseMove],
  )

  const handleMouseLeave = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      resetScales()
      onMouseLeave?.(event)
    },
    [resetScales, onMouseLeave],
  )

  return (
    <div
      ref={rootRef}
      className={`aui-dock${className ? ` ${className}` : ''}`}
      data-aui-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      style={
        {
          '--aui-dock-gap': `${gap}px`,
          '--aui-dock-return': `${returnDuration}s`,
          ...style,
        } as CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </div>
  )
}

Dock.Item = DockItem
