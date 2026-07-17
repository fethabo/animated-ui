// border-beam.tsx — Cometa de luz que recorre el perímetro del borde en loop.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// CSS casi puro: solo la cabeza del cometa sigue el perímetro con precisión
// (`offset-path: border-box` + `offset-distance` animado 0→100%, sin JS por
// frame). El nodo es rígido, así que en las esquinas la estela quedaría
// recta sobre la tangente si no se recortara: la capa se enmascara al
// anillo del borde (`mask-clip: padding-box, border-box` +
// `mask-composite: intersect`) para que del cometa solo se vea la
// intersección con esa curva. En browsers sin soporte de `offset-path:
// border-box` o del enmascarado compuesto, @supports oculta el cometa sin
// romper nada. Con prefers-reduced-motion se muestra solo un realce de
// borde estático.
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
  padding: 2px;
  mask-image: linear-gradient(#000, #000), linear-gradient(#000, #000);
  mask-clip: padding-box, border-box;
  mask-composite: intersect;
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
@supports not (mask-composite: intersect) {
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
