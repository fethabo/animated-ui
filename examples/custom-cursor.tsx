// custom-cursor.tsx — Cursor personalizado (dot + anillo con lag elástico)
// scoped a su contenedor, sin portales.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El pointermove escribe CSS vars (--cursor-x/y) sobre el contenedor: dot y
// ring se posicionan desde ellas sin re-renders de React. El lag del anillo
// es una CSS transition (sin RAF). El estado hover se detecta por delegación
// (pointerover + closest sobre links/botones) y se refleja en un data
// attribute que escala el anillo. En dispositivos sin hover real ni puntero
// fino los nodos custom no se montan y el cursor nativo queda intacto. Con
// prefers-reduced-motion el seguimiento es directo, sin transiciones.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef, useState } from 'react'

const DOT_SIZE = 8
const RING_SIZE = 36
const COLOR = '#7c3aed'
const LAG = 0.15 // segundos
const HOVER_SCALE = 1.8

const CSS = `
.cc-root {
  position: relative;
}
.cc-root[data-hidden-cursor],
.cc-root[data-hidden-cursor] * {
  cursor: none;
}
.cc-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.cc-root[data-visible] > .cc-layer {
  opacity: 1;
}
.cc-dot,
.cc-ring {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
}
.cc-dot {
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
  background: ${COLOR};
  transform: translate(var(--cursor-x, -100px), var(--cursor-y, -100px)) translate(-50%, -50%);
}
.cc-ring {
  width: ${RING_SIZE}px;
  height: ${RING_SIZE}px;
  border: 1.5px solid ${COLOR};
  transform: translate(var(--cursor-x, -100px), var(--cursor-y, -100px)) translate(-50%, -50%)
    scale(var(--cursor-scale, 1));
  transition: transform ${LAG}s ease-out;
}
.cc-root[data-state="hover"] { --cursor-scale: ${HOVER_SCALE}; }
.cc-root[data-state="down"] { --cursor-scale: 0.75; }
@media (prefers-reduced-motion: reduce) {
  .cc-ring { transition: none; }
}
`

export default function CustomCursorDemo() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!document.getElementById('cc-styles')) {
      const style = document.createElement('style')
      style.id = 'cc-styles'
      style.textContent = CSS
      document.head.appendChild(style)
    }
    // Guarda de dispositivo: solo puntero fino con hover real.
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !enabled) return

    let hovering = false
    let pressed = false
    const syncState = () => {
      root.setAttribute('data-state', pressed ? 'down' : hovering ? 'hover' : 'idle')
    }

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      root.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`)
      root.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`)
      root.setAttribute('data-visible', '')
    }
    const onLeave = () => {
      root.removeAttribute('data-visible')
      hovering = false
      pressed = false
      syncState()
    }
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null
      const interactive = target?.closest?.('a, button, [role="button"], [data-cursor]')
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
      className="cc-root"
      data-state="idle"
      data-hidden-cursor={enabled ? '' : undefined}
      style={{
        minHeight: 400,
        background: '#0f0f1a',
        color: '#e2e8f0',
        display: 'grid',
        placeItems: 'center',
        gap: '1rem',
        fontFamily: 'system-ui',
      }}
    >
      <button type="button" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
        El anillo se agranda acá
      </button>
      {enabled ? (
        <div className="cc-layer" aria-hidden="true">
          <div className="cc-ring" />
          <div className="cc-dot" />
        </div>
      ) : null}
    </div>
  )
}
