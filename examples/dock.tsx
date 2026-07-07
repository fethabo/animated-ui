// dock.tsx — Fila de ítems que se magnifican por proximidad del cursor
// (efecto dock de macOS).
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// En cada mousemove, cada ítem calcula su distancia horizontal al cursor y
// escala con una campana coseno (máximo en el cursor, 1 fuera del radio),
// escribiendo `scale` directo al style — sin re-renders de React por frame.
// Al salir el cursor, la transition CSS devuelve todo a escala base. En touch
// (sin cursor) queda como fila estática funcional; con prefers-reduced-motion
// la magnificación se desactiva.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useRef, type MouseEvent } from 'react'

const MAGNIFICATION = 1.8 // escala máxima bajo el cursor
const RADIUS = 140 // px de influencia
const RETURN = 0.25 // s del retorno a escala base

const ICONS = ['🏠', '🔍', '💬', '🎵', '📷', '⚙️']

// Campana coseno: MAGNIFICATION en el cursor, 1 exacto en ±RADIUS.
function magnify(distance: number): number {
  const d = Math.abs(distance)
  if (d >= RADIUS) return 1
  const bell = (Math.cos((d / RADIUS) * Math.PI) + 1) / 2
  return 1 + (MAGNIFICATION - 1) * bell
}

export default function DockDemo() {
  const dockRef = useRef<HTMLDivElement>(null)

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const dock = dockRef.current
    if (!dock) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    dock.querySelectorAll<HTMLElement>('[data-dock-item]').forEach((item) => {
      const rect = item.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const scale = magnify(event.clientX - center)
      item.style.scale = scale === 1 ? '' : String(scale)
    })
  }

  const onMouseLeave = () => {
    dockRef.current
      ?.querySelectorAll<HTMLElement>('[data-dock-item]')
      .forEach((item) => (item.style.scale = ''))
  }

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'end center',
        height: '60vh',
        paddingBottom: 24,
        background: '#0a0a12',
      }}
    >
      <div
        ref={dockRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {ICONS.map((icon) => (
          <div
            key={icon}
            data-dock-item=""
            style={{
              // Escala desde la base (crece "hacia arriba", como macOS) con
              // retorno elástico por transition.
              transformOrigin: '50% 100%',
              transition: `scale ${RETURN}s ease-out`,
              willChange: 'scale',
            }}
          >
            <button
              style={{
                width: 52,
                height: 52,
                fontSize: 26,
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.14)',
              }}
            >
              {icon}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
