// draw-path.tsx — Un SVG que se "dibuja" trazo a trazo al entrar al viewport.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Line-drawing clásico: cada elemento con trazo recibe stroke-dasharray =
// stroke-dashoffset = su longitud medida con getTotalLength() (queda
// "enrollado") y una animación CSS lleva el offset a 0 — cero JS por frame.
// El stagger es animation-delay incremental por orden documental. Los
// elementos sin getTotalLength (browsers viejos) quedan visibles sin animar.
// Con prefers-reduced-motion el SVG se muestra completo directo.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const CSS = `
.draw.drawn .stroke { animation: draw 1.4s ease-in-out both; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) {
  .draw.drawn .stroke { animation: none; stroke-dashoffset: 0 !important; }
}
`

export default function DrawPathDemo() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    if (!document.getElementById('draw-demo-css')) {
      const style = document.createElement('style')
      style.id = 'draw-demo-css'
      style.textContent = CSS
      document.head.appendChild(style)
    }
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setDrawn(true),
      { threshold: 0.4 },
    )
    io.observe(rootRef.current!)
    return () => io.disconnect()
  }, [])

  // Rebobinar cada trazo antes del paint, con stagger por orden documental.
  useLayoutEffect(() => {
    const strokes = rootRef.current!.querySelectorAll<SVGGeometryElement>(
      'path, line, polyline, circle, rect, ellipse',
    )
    let i = 0
    for (const el of strokes) {
      if (typeof el.getTotalLength !== 'function') continue
      const length = el.getTotalLength()
      el.style.strokeDasharray = `${length}`
      el.style.strokeDashoffset = `${length}`
      el.style.animationDelay = `${i * 0.3}s`
      el.classList.add('stroke')
      i++
    }
  }, [])

  return (
    <div ref={rootRef} className={`draw${drawn ? ' drawn' : ''}`} style={{ padding: '50vh 0 60vh' }}>
      <svg viewBox="0 0 220 120" width={440} fill="none" strokeWidth={3} strokeLinecap="round">
        <path d="M 10 100 Q 60 10 110 70 T 210 40" stroke="#0ea5e9" />
        <circle cx="60" cy="60" r="28" stroke="#f59e0b" />
        <rect x="140" y="60" width="60" height="44" rx="8" stroke="#a3e635" />
      </svg>
    </div>
  )
}
