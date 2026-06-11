'use client'
import { useCallback, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { magneticOffset } from './offset'
import type { MagneticElementProps, MagneticState } from './types'

export type { MagneticElementProps, MagneticState } from './types'

const NEUTRAL: MagneticState = { offsetX: 0, offsetY: 0, isActive: false }

// Easing back-out: retorno con leve rebote elástico al soltar el contenido.
const ELASTIC_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

/**
 * Wrapper que atrae su contenido hacia el cursor, con retorno elástico al
 * salir. La zona de atracción se agranda con padding transparente
 * (`hitArea`), sin listeners globales; la traslación usa WAAPI con
 * interpolación que preserva momentum (patrón TiltCard sobre `translate`).
 *
 * `children` puede ser un nodo React normal o una función
 * `({ offsetX, offsetY, isActive }) => ReactNode` para efectos derivados.
 */
export function MagneticElement({
  strength = 0.35,
  hitArea = 40,
  respectReducedMotion = true,
  children,
  className,
  style,
  onMouseMove,
  onMouseLeave,
  ...rest
}: MagneticElementProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const stateRef = useRef<MagneticState>(NEUTRAL)

  const reducedMotion = useReducedMotion()
  const disableMagnet = respectReducedMotion && reducedMotion
  const hasRenderProp = typeof children === 'function'

  // El estado de React solo se actualiza si hay render prop: con children
  // estáticos el efecto es 100% imperativo y no causa re-renders por mousemove.
  const [magneticState, setMagneticState] = useState<MagneticState>(NEUTRAL)

  const applyOffset = useCallback(
    (offsetX: number, offsetY: number, isActive: boolean, elastic: boolean) => {
      stateRef.current = { offsetX, offsetY, isActive }
      if (hasRenderProp) setMagneticState(stateRef.current)

      const element = contentRef.current
      if (element && typeof element.animate === 'function') {
        const previous = animationRef.current
        if (previous) {
          try {
            previous.commitStyles()
          } catch {
            // commitStyles falla si el elemento ya no está renderizado; se ignora.
          }
          previous.cancel()
        }
        animationRef.current = element.animate(
          [{ transform: `translate(${offsetX}px, ${offsetY}px)` }],
          elastic
            ? { duration: 450, fill: 'forwards', easing: ELASTIC_EASING }
            : { duration: 150, fill: 'forwards', easing: 'ease-out' },
        )
      }
    },
    [hasRenderProp],
  )

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (disableMagnet) {
        if (!stateRef.current.isActive) applyOffset(0, 0, true, false)
      } else {
        const rect = event.currentTarget.getBoundingClientRect()
        const { offsetX, offsetY } = magneticOffset(
          event.clientX - rect.left,
          event.clientY - rect.top,
          rect.width,
          rect.height,
          strength,
        )
        applyOffset(offsetX, offsetY, true, false)
      }
      onMouseMove?.(event)
    },
    [disableMagnet, strength, applyOffset, onMouseMove],
  )

  const handleMouseLeave = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      applyOffset(0, 0, false, true)
      onMouseLeave?.(event)
    },
    [applyOffset, onMouseLeave],
  )

  return (
    <div
      className={className}
      style={{ display: 'inline-block', padding: hitArea, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      <div ref={contentRef} style={{ willChange: 'transform' }}>
        {hasRenderProp ? children(magneticState) : children}
      </div>
    </div>
  )
}
