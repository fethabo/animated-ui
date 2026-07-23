'use client'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { attachTilt, type TiltEngineInstance } from './engine'
import type { TiltCardProps, TiltState } from './types'

export type { TiltCardProps, TiltState, UseTiltOptions } from './types'
export { useTilt } from './use-tilt'

const NEUTRAL: TiltState = { tiltX: 0, tiltY: 0, isHovering: false }

/**
 * Card con efecto 3D tilt que sigue al mouse, animado con WAAPI
 * (`element.animate`) para interpolar suavemente entre estados y preservar
 * momentum al cambiar de dirección. La lógica vive en el motor compartido
 * (`engine.ts`), el mismo que consume el hook `useTilt`.
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
  const rootRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<TiltEngineInstance | null>(null)

  const reducedMotion = useReducedMotion()
  const disableTilt = respectReducedMotion && reducedMotion
  const hasRenderProp = typeof children === 'function'

  // El estado de React solo se actualiza si hay render prop: con children
  // estáticos el tilt es 100% imperativo y no causa re-renders por mousemove.
  const [tiltState, setTiltState] = useState<TiltState>(NEUTRAL)

  // El motor reporta cada estado por acá; el ref lee siempre el render
  // vigente (maxAngle/disableTilt/hasRenderProp) sin re-atar el motor.
  const onStateRef = useRef<(state: TiltState) => void>(() => {})
  onStateRef.current = ({ tiltX, tiltY, isHovering }) => {
    if (hasRenderProp) setTiltState({ tiltX, tiltY, isHovering })

    const glareElement = glareRef.current
    if (glareElement) {
      // El brillo se desplaza inversamente al tilt, simulando una luz fija.
      const offsetX = 50 - (tiltY / maxAngle) * 40
      const offsetY = 50 + (tiltX / maxAngle) * 40
      glareElement.style.background = `radial-gradient(circle at ${offsetX}% ${offsetY}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%)`
      glareElement.style.opacity = isHovering && !disableTilt ? '1' : '0'
    }
  }

  useEffect(() => {
    const host = rootRef.current
    const inner = innerRef.current
    if (!host || !inner) return
    // La rotación va al div inner (preserve-3d); la perspectiva la aporta el
    // wrapper via CSS, así que el motor no la incluye en el transform.
    const engine = attachTilt(
      host,
      {
        maxAngle,
        reducedMotion: disableTilt,
        onState: (state) => onStateRef.current(state),
      },
      inner,
    )
    engineRef.current = engine
    return () => {
      engine.destroy()
      engineRef.current = null
    }
    // Attach una sola vez; los cambios de opciones van por update() abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    engineRef.current?.update({ maxAngle, reducedMotion: disableTilt })
  }, [maxAngle, disableTilt])

  return (
    <div
      ref={rootRef}
      className={className}
      // El consumer puede pisar la perspectiva con `--aui-tilt-perspective`
      // en su CSS; la prop `perspective` actúa como fallback.
      style={{ perspective: `var(--aui-tilt-perspective, ${perspective}px)`, ...style }}
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
