'use client'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { attachGlow, type GlowEngineInstance } from './engine'
import { glowVars } from './vars'
import type { GlowBorderProps } from './types'

export type { GlowBorderProps, UseGlowBorderOptions } from './types'
export { useGlowBorder } from './use-glow-border'

/**
 * Contenedor con borde de gradiente cónico animado.
 *
 * Por default el gradiente rota en loop; con `followCursor` apunta hacia el
 * cursor con momentum (patrón WAAPI de TiltCard). El gradiente solo es
 * visible como anillo perimetral: el contenido lo tapa con su propio
 * background (pasalo via `contentClassName`/`contentStyle`). La lógica vive
 * en el motor compartido (`engine.ts`), el mismo que consume el hook
 * `useGlowBorder`; acá el JSX aporta clase, vars, capa y atributo de loop
 * (visibles en SSR) y el motor solo el seguimiento del cursor.
 */
export function GlowBorder({
  colors,
  speed,
  width,
  radius,
  opacity,
  followCursor = false,
  respectReducedMotion = true,
  contentClassName,
  contentStyle,
  children,
  className,
  style,
  ...rest
}: GlowBorderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<GlowEngineInstance | null>(null)

  const reducedMotion = useReducedMotion()
  const loopActive = !followCursor && !(respectReducedMotion && reducedMotion)

  useEffect(() => {
    const host = rootRef.current
    const layer = layerRef.current
    if (!host || !layer) return
    const engine = attachGlow(
      host,
      // El loop lo gatea el atributo data-aui-loop del JSX; el motor solo
      // maneja followCursor sobre la capa provista.
      { followCursor, reducedMotion: false, decorate: false },
      layer,
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
    engineRef.current?.update({ followCursor })
  }, [followCursor])

  return (
    <div
      ref={rootRef}
      className={`aui-glow${className ? ` ${className}` : ''}`}
      data-aui-loop={loopActive ? '' : undefined}
      style={{ ...glowVars({ colors, speed, width, radius, opacity }), ...style }}
      {...rest}
    >
      <div ref={layerRef} aria-hidden="true" className="aui-glow-layer" />
      <div className={`aui-glow-content${contentClassName ? ` ${contentClassName}` : ''}`} style={contentStyle}>
        {children}
      </div>
    </div>
  )
}
