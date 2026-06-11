'use client'
import { useCallback, useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { spotlightVars } from './vars'
import type { SpotlightCardProps } from './types'

export type { SpotlightCardProps } from './types'

const CSS = `
.aui-spotlight {
  position: relative;
}
.aui-spotlight-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: radial-gradient(
    circle var(--aui-spotlight-radius, 250px) at var(--aui-spotlight-x, 50%) var(--aui-spotlight-y, 50%),
    var(--aui-spotlight-color, rgba(255, 255, 255, 0.15)) 0%,
    transparent 100%
  );
  z-index: 1;
}
.aui-spotlight[data-aui-hover] > .aui-spotlight-overlay {
  opacity: var(--aui-spotlight-opacity, 1);
}
`

/**
 * Contenedor con spotlight radial que sigue al cursor.
 *
 * El tracking escribe `--aui-spotlight-x/y` directamente sobre el elemento
 * (sin estado de React): el movimiento del mouse no provoca re-renders de
 * los children. El overlay tiene `pointer-events: none`, así que el
 * contenido sigue siendo interactivo.
 */
export function SpotlightCard({
  color,
  radius,
  opacity,
  respectReducedMotion = true,
  children,
  className,
  style,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: SpotlightCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    injectStyles(styleId('spotlight-card'), CSS)
  }, [])

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const root = rootRef.current
      if (root) {
        const rect = root.getBoundingClientRect()
        root.style.setProperty('--aui-spotlight-x', `${event.clientX - rect.left}px`)
        root.style.setProperty('--aui-spotlight-y', `${event.clientY - rect.top}px`)
      }
      onMouseMove?.(event)
    },
    [onMouseMove],
  )

  const handleMouseEnter = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      rootRef.current?.setAttribute('data-aui-hover', '')
      onMouseEnter?.(event)
    },
    [onMouseEnter],
  )

  const handleMouseLeave = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      rootRef.current?.removeAttribute('data-aui-hover')
      onMouseLeave?.(event)
    },
    [onMouseLeave],
  )

  return (
    <div
      ref={rootRef}
      className={`aui-spotlight${className ? ` ${className}` : ''}`}
      style={{ ...spotlightVars({ color, radius, opacity }), ...style }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
      <div aria-hidden="true" className="aui-spotlight-overlay" />
    </div>
  )
}
