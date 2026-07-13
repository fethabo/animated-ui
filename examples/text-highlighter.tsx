// text-highlighter.tsx — Subrayado "a mano alzada" que se dibuja solo.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// La técnica de line-drawing: el path recibe stroke-dasharray =
// stroke-dashoffset = su longitud (getTotalLength(), queda "enrollado") y
// una animación CSS lleva el offset a 0 — cero JS por frame. El temblor sale
// de perturbar los puntos de una línea con un PRNG seedable (sin
// Math.random: mismo render en cada repaint). El texto queda intacto: el SVG
// es un overlay absoluto aria-hidden sin eventos. Con prefers-reduced-motion
// el trazo aparece completo, sin animación.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const CSS = `
.hl { position: relative; display: inline-block; }
.hl svg {
  position: absolute; inset: 0; width: 100%; height: 100%;
  overflow: visible; pointer-events: none;
}
.hl path {
  fill: none; stroke: #f43f5e; stroke-width: 3;
  stroke-linecap: round; stroke-linejoin: round;
}
.hl.drawn path { animation: hl-draw 0.9s ease-in-out both; }
@keyframes hl-draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) {
  .hl.drawn path { animation: none; stroke-dashoffset: 0 !important; }
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

// Subrayado con temblor: dos pasadas de curvas cuadráticas perturbadas.
function underlinePath(width: number, height: number, seed: number) {
  const rng = prng(seed)
  const j = (amount: number) => (rng() * 2 - 1) * amount
  const passes: string[] = []
  for (let p = 0; p < 2; p++) {
    const y = height - 2
    let d = `M ${j(2)} ${y + j(2)}`
    for (let i = 1; i <= 3; i++) {
      const x = (width / 3) * i
      d += ` Q ${x - width / 6 + j(3)} ${y + j(3)} ${x + j(2)} ${y + j(2)}`
    }
    passes.push(d)
  }
  return passes.join(' ')
}

export default function TextHighlighterDemo() {
  const rootRef = useRef<HTMLSpanElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    if (!document.getElementById('hl-demo-css')) {
      const style = document.createElement('style')
      style.id = 'hl-demo-css'
      style.textContent = CSS
      document.head.appendChild(style)
    }
    const el = rootRef.current!
    const ro = new ResizeObserver(([entry]) =>
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height }),
    )
    ro.observe(el)
    // Dispara al entrar al viewport.
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setDrawn(true), {
      threshold: 0.5,
    })
    io.observe(el)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  // Rebobinar antes del paint: dash = offset = longitud medida.
  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path || typeof path.getTotalLength !== 'function') return
    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
  }, [size])

  return (
    <p style={{ fontFamily: 'system-ui', fontSize: '1.5rem', padding: '40vh 2rem 60vh' }}>
      Scrolleá hasta acá: la parte{' '}
      <span ref={rootRef} className={`hl${drawn ? ' drawn' : ''}`}>
        importante
        {size.width > 0 && (
          <svg viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
            <path ref={pathRef} d={underlinePath(size.width, size.height, 7)} />
          </svg>
        )}
      </span>{' '}
      se subraya sola.
    </p>
  )
}
