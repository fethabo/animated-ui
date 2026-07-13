'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { CustomCursorProps } from './types'

export type { CustomCursorProps } from './types'

// Dot y ring se posicionan desde `--aui-cursor-x/y` (escritas por pointermove
// sobre el root, sin estado de React): heredan las vars por cascada. El lag
// del ring es una transition de transform — sin RAF propio. El estado
// (`idle`/`hover`/`down`) vive en `data-aui-cursor-state` y escala el ring via
// `--aui-cursor-scale`. `cursor: none` queda scoped al contenedor (y sus
// descendientes) solo cuando el componente decide ocultar el cursor nativo.
const CSS = `
.aui-custom-cursor {
  position: relative;
}
.aui-custom-cursor[data-aui-cursor-native-hidden],
.aui-custom-cursor[data-aui-cursor-native-hidden] * {
  cursor: none;
}
.aui-custom-cursor-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.aui-custom-cursor[data-aui-cursor-visible] > .aui-custom-cursor-layer {
  opacity: 1;
}
.aui-custom-cursor-dot,
.aui-custom-cursor-ring {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  will-change: transform;
}
.aui-custom-cursor-dot {
  width: var(--aui-cursor-dot-size, 8px);
  height: var(--aui-cursor-dot-size, 8px);
  background: var(--aui-cursor-color, #7c3aed);
  transform: translate(var(--aui-cursor-x, -100px), var(--aui-cursor-y, -100px))
    translate(-50%, -50%);
}
.aui-custom-cursor-ring {
  width: var(--aui-cursor-ring-size, 36px);
  height: var(--aui-cursor-ring-size, 36px);
  border: 1.5px solid var(--aui-cursor-color, #7c3aed);
  transform: translate(var(--aui-cursor-x, -100px), var(--aui-cursor-y, -100px))
    translate(-50%, -50%) scale(var(--aui-cursor-scale, 1));
  transition: transform var(--aui-cursor-lag, 0.15s) ease-out;
}
.aui-custom-cursor[data-aui-cursor-state="hover"] {
  --aui-cursor-scale: var(--aui-cursor-hover-scale, 1.5);
}
.aui-custom-cursor[data-aui-cursor-state="down"] {
  --aui-cursor-scale: 0.75;
}
.aui-custom-cursor[data-aui-static] .aui-custom-cursor-ring {
  transition: none;
}
`

/** Elementos que disparan el estado `hover` del cursor (delegación). */
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [data-aui-cursor]'

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

/**
 * Cursor personalizado (punto + anillo con lag elástico) que reemplaza al
 * cursor nativo **dentro de su contenedor** — sin portales ni efectos a nivel
 * documento. El anillo se agranda sobre elementos interactivos (delegación
 * `pointerover` + `closest`), y el estado se expone como
 * `data-aui-cursor-state="idle" | "hover" | "down"` para estilado custom.
 *
 * En dispositivos sin hover real ni puntero fino (touch) no monta los nodos
 * del cursor ni toca el cursor nativo: los children quedan intactos. Con
 * `prefers-reduced-motion` el seguimiento es directo (sin lag elástico).
 */
export function CustomCursor({
  dotSize = 8,
  ringSize = 36,
  color = '#7c3aed',
  lag = 0.15,
  hoverScale = 1.5,
  hideNativeCursor = true,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: CustomCursorProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('custom-cursor'), CSS)
  }, [])

  // Guarda de dispositivo: solo puntero fino con hover real. En SSR y en el
  // primer render del cliente `enabled` es false (los nodos custom no
  // existen), así touch nunca ve el cursor custom ni pierde el nativo.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mediaQuery = window.matchMedia(FINE_POINTER_QUERY)
    setEnabled(mediaQuery.matches)
    const onChange = (event: MediaQueryListEvent) => setEnabled(event.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  // Tracking y estados, todo imperativo sobre el root: cero re-renders por
  // frame. Listeners propios (no props del root) para no pisar los del consumer.
  useEffect(() => {
    const root = rootRef.current
    if (!root || !enabled) return

    let hovering = false
    let pressed = false

    const syncState = () => {
      root.setAttribute('data-aui-cursor-state', pressed ? 'down' : hovering ? 'hover' : 'idle')
    }

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      root.style.setProperty('--aui-cursor-x', `${event.clientX - rect.left}px`)
      root.style.setProperty('--aui-cursor-y', `${event.clientY - rect.top}px`)
      root.setAttribute('data-aui-cursor-visible', '')
    }
    const onLeave = () => {
      root.removeAttribute('data-aui-cursor-visible')
      hovering = false
      pressed = false
      syncState()
    }
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null
      const interactive = target?.closest?.(INTERACTIVE_SELECTOR)
      hovering = !!interactive && root.contains(interactive)
      syncState()
    }
    const onDown = () => {
      pressed = true
      syncState()
    }
    const onUp = () => {
      pressed = false
      syncState()
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('pointerover', onOver)
    root.addEventListener('pointerdown', onDown)
    root.addEventListener('pointerup', onUp)
    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointerover', onOver)
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('pointerup', onUp)
    }
  }, [enabled])

  return (
    <div
      ref={rootRef}
      className={`aui-custom-cursor${className ? ` ${className}` : ''}`}
      data-aui-cursor-state="idle"
      data-aui-cursor-native-hidden={enabled && hideNativeCursor ? '' : undefined}
      data-aui-static={isStatic ? '' : undefined}
      style={
        {
          '--aui-cursor-dot-size': `${dotSize}px`,
          '--aui-cursor-ring-size': `${ringSize}px`,
          '--aui-cursor-color': color,
          '--aui-cursor-lag': `${lag}s`,
          '--aui-cursor-hover-scale': hoverScale,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
      {enabled ? (
        <div className="aui-custom-cursor-layer" aria-hidden="true">
          <div className="aui-custom-cursor-ring" />
          <div className="aui-custom-cursor-dot" />
        </div>
      ) : null}
    </div>
  )
}
