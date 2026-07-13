'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { RippleContainerProps } from './types'

export type { RippleContainerProps } from './types'

// Las ondas viven en una capa propia con overflow hidden y pointer-events
// none: nunca interceptan clicks ni foco de los children, y quedan recortadas
// al contenedor (border-radius heredado). Bajo reduced motion la onda no se
// expande: solo hace fade en su posición (data-aui-static por onda).
const CSS = `
.aui-ripple {
  position: relative;
}
.aui-ripple-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}
.aui-ripple-wave {
  position: absolute;
  border-radius: 50%;
  background: var(--aui-ripple-color, currentColor);
  transform: scale(0);
  animation: aui-ripple-expand var(--aui-ripple-duration, 600ms) ease-out forwards;
  will-change: transform, opacity;
}
.aui-ripple-wave[data-aui-static] {
  transform: scale(1);
  animation: aui-ripple-fade var(--aui-ripple-duration, 600ms) ease-out forwards;
}
@keyframes aui-ripple-expand {
  from { transform: scale(0); opacity: var(--aui-ripple-opacity, 0.25); }
  to { transform: scale(1); opacity: 0; }
}
@keyframes aui-ripple-fade {
  from { opacity: var(--aui-ripple-opacity, 0.25); }
  to { opacity: 0; }
}
`

/**
 * Contenedor que dibuja una onda expansiva desde el punto exacto de cada
 * click (material ripple). Cada onda es un nodo efímero creado
 * imperativamente en `pointerdown` (la onda arranca al presionar, no al
 * soltar) y removido del DOM en `animationend` — sin estado de React por
 * onda, así los clicks rápidos generan ondas concurrentes sin re-renders.
 *
 * Customizable por props o via `--aui-ripple-*` en cascada. Con reduced
 * motion la expansión se reemplaza por un fade estático breve en el punto
 * del click (se preserva el feedback, no el movimiento).
 */
export function RippleContainer({
  color,
  duration,
  maxRadius,
  opacity,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: RippleContainerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('ripple-container'), CSS)
  }, [])

  // Listener imperativo (no prop onPointerDown del root): el spread {...rest}
  // conserva intacto cualquier handler del consumer.
  useEffect(() => {
    const root = rootRef.current
    const layer = layerRef.current
    if (!root || !layer) return

    const spawnWave = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      // Sin maxRadius, el radio llega a la esquina más lejana: la onda
      // termina cubriendo el contenedor completo desde el punto de click.
      const radius =
        maxRadius ?? Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y))

      const wave = document.createElement('span')
      wave.className = 'aui-ripple-wave'
      wave.style.left = `${x - radius}px`
      wave.style.top = `${y - radius}px`
      wave.style.width = `${radius * 2}px`
      wave.style.height = `${radius * 2}px`
      if (isStatic) wave.setAttribute('data-aui-static', '')
      wave.addEventListener('animationend', () => wave.remove())
      layer.appendChild(wave)
    }

    root.addEventListener('pointerdown', spawnWave)
    return () => root.removeEventListener('pointerdown', spawnWave)
  }, [maxRadius, isStatic])

  const rootStyle: CSSProperties = {
    ...(color !== undefined ? { '--aui-ripple-color': color } : null),
    ...(duration !== undefined ? { '--aui-ripple-duration': `${duration}ms` } : null),
    ...(opacity !== undefined ? { '--aui-ripple-opacity': opacity } : null),
    ...style,
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={`aui-ripple${className ? ` ${className}` : ''}`}
      style={rootStyle}
      {...rest}
    >
      {children}
      <div ref={layerRef} className="aui-ripple-layer" aria-hidden="true" />
    </div>
  )
}
