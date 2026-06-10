'use client'
import { useCallback, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { TiltCardProps, TiltState } from './types'

export type { TiltCardProps, TiltState } from './types'

const NEUTRAL: TiltState = { tiltX: 0, tiltY: 0, isHovering: false }

/**
 * Card con efecto 3D tilt que sigue al mouse, animado con WAAPI
 * (`element.animate`) para interpolar suavemente entre estados y preservar
 * momentum al cambiar de dirección.
 *
 * `children` puede ser un nodo React normal o una función
 * `({ tiltX, tiltY, isHovering }) => ReactNode` para construir efectos
 * derivados (parallax, color shifts) sobre el estado del tilt.
 */
export function TiltCard({
  maxAngle = 15,
  perspective = 1000,
  glare = false,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: TiltCardProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const stateRef = useRef<TiltState>(NEUTRAL)

  const reducedMotion = useReducedMotion()
  const disableTilt = respectReducedMotion && reducedMotion
  const hasRenderProp = typeof children === 'function'

  // El estado de React solo se actualiza si hay render prop: con children
  // estáticos el tilt es 100% imperativo y no causa re-renders por mousemove.
  const [tiltState, setTiltState] = useState<TiltState>(NEUTRAL)

  const applyTilt = useCallback(
    (tiltX: number, tiltY: number, isHovering: boolean) => {
      stateRef.current = { tiltX, tiltY, isHovering }
      if (hasRenderProp) setTiltState(stateRef.current)

      const element = innerRef.current
      if (element && typeof element.animate === 'function') {
        // Una animación corta con fill forwards por cada target. Antes de
        // arrancar la siguiente se consolida la anterior (commitStyles) para
        // que la nueva interpole desde el estado visual actual — eso preserva
        // el momentum — y se cancela para no acumular fill effects.
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
          [{ transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }],
          { duration: 150, fill: 'forwards', easing: 'ease-out' },
        )
      }

      const glareElement = glareRef.current
      if (glareElement) {
        // El brillo se desplaza inversamente al tilt, simulando una luz fija.
        const offsetX = 50 - (tiltY / maxAngle) * 40
        const offsetY = 50 + (tiltX / maxAngle) * 40
        glareElement.style.background = `radial-gradient(circle at ${offsetX}% ${offsetY}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%)`
        glareElement.style.opacity = isHovering && !disableTilt ? '1' : '0'
      }
    },
    [hasRenderProp, maxAngle, disableTilt],
  )

  const onMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (disableTilt) {
        applyTilt(0, 0, true)
        return
      }
      const rect = event.currentTarget.getBoundingClientRect()
      const relX = (event.clientX - rect.left) / rect.width - 0.5
      const relY = (event.clientY - rect.top) / rect.height - 0.5
      // Mouse a la derecha → rotateY positivo; mouse arriba → rotateX positivo.
      applyTilt(-relY * 2 * maxAngle, relX * 2 * maxAngle, true)
    },
    [disableTilt, maxAngle, applyTilt],
  )

  const onMouseEnter = useCallback(() => {
    if (!stateRef.current.isHovering) applyTilt(0, 0, true)
  }, [applyTilt])

  const onMouseLeave = useCallback(() => {
    applyTilt(0, 0, false)
  }, [applyTilt])

  return (
    <div
      className={className}
      // El consumer puede pisar la perspectiva con `--aui-tilt-perspective`
      // en su CSS; la prop `perspective` actúa como fallback.
      style={{ perspective: `var(--aui-tilt-perspective, ${perspective}px)`, ...style }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rest}
    >
      <div
        ref={innerRef}
        style={{ position: 'relative', transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {hasRenderProp ? children(tiltState) : children}
        {glare ? (
          <div
            ref={glareRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              borderRadius: 'inherit',
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
