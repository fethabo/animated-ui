'use client'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { attachMagnetic, type MagneticEngineInstance } from './engine'
import type { MagneticElementProps, MagneticState } from './types'

export type { MagneticElementProps, MagneticState, UseMagneticOptions } from './types'
export { useMagnetic } from './use-magnetic'

const NEUTRAL: MagneticState = { offsetX: 0, offsetY: 0, isActive: false }

/**
 * Wrapper que atrae su contenido hacia el cursor, con retorno elástico al
 * salir. La zona de atracción se agranda con padding transparente
 * (`hitArea`), sin listeners globales. La lógica vive en el motor compartido
 * (`engine.ts`), el mismo que consume el hook `useMagnetic`.
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
  ...rest
}: MagneticElementProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<MagneticEngineInstance | null>(null)

  const reducedMotion = useReducedMotion()
  const disableMagnet = respectReducedMotion && reducedMotion
  const hasRenderProp = typeof children === 'function'

  // El estado de React solo se actualiza si hay render prop: con children
  // estáticos el efecto es 100% imperativo y no causa re-renders por mousemove.
  const [magneticState, setMagneticState] = useState<MagneticState>(NEUTRAL)

  const onStateRef = useRef<(state: MagneticState) => void>(() => {})
  onStateRef.current = (state) => {
    if (hasRenderProp) setMagneticState(state)
  }

  useEffect(() => {
    const host = hostRef.current
    const content = contentRef.current
    if (!host || !content) return
    // El host (con su padding de hitArea) escucha; el contenido se traslada.
    const engine = attachMagnetic(
      host,
      {
        strength,
        reducedMotion: disableMagnet,
        onState: (state) => onStateRef.current(state),
      },
      content,
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
    engineRef.current?.update({ strength, reducedMotion: disableMagnet })
  }, [strength, disableMagnet])

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ display: 'inline-block', padding: hitArea, ...style }}
      {...rest}
    >
      <div ref={contentRef} style={{ willChange: 'transform' }}>
        {hasRenderProp ? children(magneticState) : children}
      </div>
    </div>
  )
}
