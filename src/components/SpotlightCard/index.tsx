'use client'
import { useEffect, useRef } from 'react'
import { attachSpotlight, type SpotlightEngineInstance } from './engine'
import { spotlightVars } from './vars'
import type { SpotlightCardProps } from './types'

export type { SpotlightCardProps, UseSpotlightOptions } from './types'
export { useSpotlight } from './use-spotlight'

/**
 * Contenedor con spotlight radial que sigue al cursor.
 *
 * El tracking escribe `--aui-spotlight-x/y` directamente sobre el elemento
 * (sin estado de React): el movimiento del mouse no provoca re-renders de
 * los children. El overlay tiene `pointer-events: none`, así que el
 * contenido sigue siendo interactivo. La lógica vive en el motor compartido
 * (`engine.ts`), el mismo que consume el hook `useSpotlight`; acá el JSX
 * aporta clase, vars y overlay (visibles en SSR) y el motor solo el tracking.
 */
export function SpotlightCard({
  color,
  radius,
  opacity,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: SpotlightCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<SpotlightEngineInstance | null>(null)

  useEffect(() => {
    const host = rootRef.current
    if (!host) return
    const engine = attachSpotlight(host, { decorate: false })
    engineRef.current = engine
    return () => {
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={`aui-spotlight${className ? ` ${className}` : ''}`}
      style={{ ...spotlightVars({ color, radius, opacity }), ...style }}
      {...rest}
    >
      {children}
      <div aria-hidden="true" className="aui-spotlight-overlay" />
    </div>
  )
}
