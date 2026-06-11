'use client'
import { useCallback, useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { pointerAngle, unwrapAngle } from './geometry'
import { glowVars } from './vars'
import type { GlowBorderProps } from './types'

export type { GlowBorderProps } from './types'

// La capa cónica se sobredimensiona (inset: -150%) para que al rotar siga
// cubriendo las esquinas del contenedor en aspect ratios de hasta ~4:1.
// Se anima `transform` (compositor, soporte universal) en vez del ángulo
// del gradiente, que requeriría `@property`.
const CSS = `
.aui-glow {
  position: relative;
  overflow: hidden;
  padding: var(--aui-glow-width, 1px);
  border-radius: var(--aui-glow-radius, 12px);
  isolation: isolate;
}
.aui-glow-layer {
  position: absolute;
  inset: -150%;
  z-index: -1;
  background: conic-gradient(
    from 0deg,
    var(--aui-glow-color-1, #7c3aed),
    var(--aui-glow-color-2, #0ea5e9),
    var(--aui-glow-color-3, #ec4899),
    var(--aui-glow-color-1, #7c3aed)
  );
  opacity: var(--aui-glow-opacity, 1);
}
.aui-glow[data-aui-loop] > .aui-glow-layer {
  animation: aui-glow-spin var(--aui-glow-speed, 4s) linear infinite;
}
@keyframes aui-glow-spin {
  to { transform: rotate(360deg); }
}
.aui-glow-content {
  position: relative;
  border-radius: calc(var(--aui-glow-radius, 12px) - var(--aui-glow-width, 1px));
}
`

/**
 * Contenedor con borde de gradiente cónico animado.
 *
 * Por default el gradiente rota en loop; con `followCursor` apunta hacia el
 * cursor con momentum (patrón WAAPI de TiltCard). El gradiente solo es
 * visible como anillo perimetral: el contenido lo tapa con su propio
 * background (pasalo via `contentClassName`/`contentStyle`).
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
  onMouseMove,
  ...rest
}: GlowBorderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const angleRef = useRef(0)

  const reducedMotion = useReducedMotion()
  const loopActive = !followCursor && !(respectReducedMotion && reducedMotion)

  useEffect(() => {
    injectStyles(styleId('glow-border'), CSS)
  }, [])

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (followCursor) {
        const root = rootRef.current
        const layer = layerRef.current
        if (root && layer && typeof layer.animate === 'function') {
          const rect = root.getBoundingClientRect()
          const raw = pointerAngle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            event.clientX,
            event.clientY,
          )
          // Camino corto desde el ángulo actual; consolidar la animación
          // anterior antes de la próxima preserva el momentum (patrón TiltCard).
          const target = unwrapAngle(angleRef.current, raw)
          const previous = animationRef.current
          if (previous) {
            try {
              previous.commitStyles()
            } catch {
              // commitStyles falla si el elemento ya no está renderizado; se ignora.
            }
            previous.cancel()
          }
          animationRef.current = layer.animate([{ transform: `rotate(${target}deg)` }], {
            duration: 200,
            fill: 'forwards',
            easing: 'ease-out',
          })
          angleRef.current = target
        }
      }
      onMouseMove?.(event)
    },
    [followCursor, onMouseMove],
  )

  // Al salir el cursor no se resetea el ángulo: el borde queda estable donde
  // estaba, sin saltos (requirement de glow-border).

  return (
    <div
      ref={rootRef}
      className={`aui-glow${className ? ` ${className}` : ''}`}
      data-aui-loop={loopActive ? '' : undefined}
      style={{ ...glowVars({ colors, speed, width, radius, opacity }), ...style }}
      onMouseMove={handleMouseMove}
      {...rest}
    >
      <div ref={layerRef} aria-hidden="true" className="aui-glow-layer" />
      <div className={`aui-glow-content${contentClassName ? ` ${contentClassName}` : ''}`} style={contentStyle}>
        {children}
      </div>
    </div>
  )
}
