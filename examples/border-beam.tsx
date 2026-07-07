// border-beam.tsx — Cometa de luz que recorre el perímetro del borde en loop.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// CSS casi puro: el cometa es un nodo con `offset-path: border-box` +
// `offset-distance` animado 0→100% — sigue el perímetro del contenedor,
// incluyendo el border-radius, sin JS por frame. `offset-rotate: auto`
// (default) orienta el degradé a lo largo del camino. En browsers sin
// soporte, @supports oculta el cometa sin romper nada. Con
// prefers-reduced-motion se muestra solo un realce de borde estático.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect } from 'react'

const CSS = `
.beam-card {
  position: relative;
  border-radius: 16px;
  padding: 28px;
  background: #12121f;
  color: #e5e5e5;
  max-width: 360px;
}
.beam-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none; /* los clicks pasan al contenido */
}
.beam-comet {
  position: absolute;
  width: 96px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(to right, transparent, #0ea5e9, #7c3aed);
  offset-path: border-box;
  offset-anchor: 100% 50%;
  animation: beam-travel 6s linear infinite;
}
@keyframes beam-travel {
  from { offset-distance: 0%; }
  to { offset-distance: 100%; }
}
@supports not (offset-path: border-box) {
  .beam-comet { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .beam-comet { display: none; }
  .beam-layer {
    box-shadow: inset 0 0 0 2px #7c3aed;
    opacity: 0.35;
  }
}
`

export default function BorderBeamDemo() {
  useEffect(() => {
    if (document.getElementById('beam-demo-css')) return
    const style = document.createElement('style')
    style.id = 'beam-demo-css'
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '60vh', background: '#0a0a12' }}>
      <div className="beam-card">
        <div className="beam-layer" aria-hidden="true">
          <div className="beam-comet" />
        </div>
        <h3 style={{ margin: '0 0 8px' }}>Card destacada</h3>
        <p style={{ margin: 0, opacity: 0.7 }}>
          El cometa recorre el borde siguiendo las esquinas redondeadas.
        </p>
      </div>
    </div>
  )
}
