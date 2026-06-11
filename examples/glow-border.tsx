// glow-border.tsx — Contenedor con borde de gradiente cónico rotando en loop.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// La capa cónica se sobredimensiona y rota con `transform` (compositor,
// soporte universal) en vez de animar el ángulo del gradiente con
// `@property`. El contenido tapa el interior; solo queda visible el anillo.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de
// tipo inline (`: number`, `: string`).

import { useEffect, type ReactNode } from 'react'

const COLORS = ['#7c3aed', '#0ea5e9', '#ec4899'] // hasta 3, el primero cierra el ciclo
const SPEED = 4 // segundos por rotación
const WIDTH = 2 // px del anillo
const RADIUS = 16 // px del border-radius exterior

const STYLE_ID = 'glow-border-demo-styles'
const CSS = `
@keyframes glow-spin {
  to { transform: rotate(360deg); }
}
.glow-demo-layer {
  position: absolute;
  inset: -150%;
  z-index: -1;
  animation: glow-spin ${SPEED}s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .glow-demo-layer { animation: none; }
}
`

function GlowBorder({ children }: { children?: ReactNode }) {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: WIDTH,
        borderRadius: RADIUS,
        isolation: 'isolate',
      }}
    >
      <div
        aria-hidden="true"
        className="glow-demo-layer"
        style={{
          background: `conic-gradient(from 0deg, ${COLORS[0]}, ${COLORS[1]}, ${COLORS[2]}, ${COLORS[0]})`,
        }}
      />
      <div
        style={{
          position: 'relative',
          borderRadius: RADIUS - WIDTH,
          background: '#12121f',
          padding: '3rem 2rem',
          color: '#eee',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default function GlowBorderDemo() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', background: '#050510' }}>
      <GlowBorder>
        <h3 style={{ marginTop: 0 }}>GlowBorder</h3>
        <p style={{ opacity: 0.7 }}>El gradiente del borde rota solo, en loop.</p>
      </GlowBorder>
    </div>
  )
}
