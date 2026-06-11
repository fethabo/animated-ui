// spotlight-card.tsx — Card con spotlight radial que sigue al cursor.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El tracking escribe dos CSS custom properties directamente sobre el
// elemento (sin estado de React), así el mousemove no re-renderiza nada.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de
// tipo inline (`: number`, `: string`).

import { useRef, type ReactNode } from 'react'

const COLOR = 'rgba(255, 255, 255, 0.15)'
const RADIUS = 250 // px

function SpotlightCard({ children }: { children?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const onMouseMove = (event: { clientX: number; clientY: number }) => {
    const root = rootRef.current
    const overlay = overlayRef.current
    if (!root || !overlay) return
    const rect = root.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    overlay.style.background = `radial-gradient(circle ${RADIUS}px at ${x}px ${y}px, ${COLOR} 0%, transparent 100%)`
  }

  const setOverlayOpacity = (value: string) => {
    if (overlayRef.current) overlayRef.current.style.opacity = value
  }

  return (
    <div
      ref={rootRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setOverlayOpacity('1')}
      onMouseLeave={() => setOverlayOpacity('0')}
      style={{
        position: 'relative',
        width: 320,
        padding: '3rem 2rem',
        borderRadius: 16,
        background: '#12121f',
        border: '1px solid #333',
        color: '#eee',
      }}
    >
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  )
}

export default function SpotlightDemo() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', background: '#050510' }}>
      <SpotlightCard>
        <h3 style={{ marginTop: 0 }}>Spotlight</h3>
        <p style={{ opacity: 0.7 }}>Mové el mouse sobre el card: la luz sigue al cursor.</p>
      </SpotlightCard>
    </div>
  )
}
