// scribble-decoration.tsx — Flecha garabateada que se dibuja y redibuja.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El garabato es un path generado proceduralmente: los puntos de una flecha
// paramétrica se perturban con un PRNG seedable (sin Math.random — misma
// seed, mismo garabato en cada render) y se unen con curvas cuadráticas. El
// dibujo es line-drawing puro: dash = offset = getTotalLength() y una
// animación CSS en loop que dibuja, sostiene, desvanece y rebobina. Con
// prefers-reduced-motion el garabato queda completo y estático.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useLayoutEffect, useRef } from 'react'

const CSS = `
.scribble svg { overflow: visible; }
.scribble path {
  fill: none; stroke: #f43f5e; stroke-width: 4;
  stroke-linecap: round; stroke-linejoin: round;
  animation: scribble-cycle 3s ease-in-out infinite;
}
@keyframes scribble-cycle {
  0% { stroke-dashoffset: var(--len); opacity: 1; }
  45%, 72% { stroke-dashoffset: 0; opacity: 1; }
  90% { stroke-dashoffset: 0; opacity: 0; }
  100% { stroke-dashoffset: var(--len); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .scribble path { animation: none; stroke-dashoffset: 0 !important; opacity: 1; }
}
`

// PRNG seedable mínimo (mulberry32): determinista, sin Math.random.
function prng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Flecha a mano alzada: fuste arqueado + dos alas, con jitter en cada punto.
function arrowPath(width: number, height: number, seed: number) {
  const rng = prng(seed)
  const j = (amount: number) => (rng() * 2 - 1) * amount
  const tip = { x: width * 0.92 + j(4), y: height * 0.42 + j(4) }
  const shaft =
    `M ${width * 0.06 + j(4)} ${height * 0.62 + j(4)} ` +
    `Q ${width * 0.5 + j(8)} ${height * 0.75 + j(8)} ${tip.x} ${tip.y}`
  const wing = (angle: number) =>
    `${tip.x - Math.cos(angle) * width * 0.22} ${tip.y - Math.sin(angle) * width * 0.22}`
  const head = `M ${wing(-0.9)} L ${tip.x} ${tip.y} L ${wing(0.15)}`
  return `${shaft} ${head}`
}

export default function ScribbleDecorationDemo() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (document.getElementById('scribble-demo-css')) return
    const style = document.createElement('style')
    style.id = 'scribble-demo-css'
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  // Rebobinar antes del paint: el loop CSS necesita la longitud en --len.
  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path || typeof path.getTotalLength !== 'function') return
    const length = Math.ceil(path.getTotalLength())
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
    path.style.setProperty('--len', `${length}px`)
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'system-ui' }}>
      <strong style={{ fontSize: '1.5rem' }}>Mirá esto</strong>
      <span className="scribble">
        <svg width={140} height={70} viewBox="0 0 140 70" aria-hidden="true">
          <path ref={pathRef} d={arrowPath(140, 70, 7)} />
        </svg>
      </span>
    </div>
  )
}
