// horizontal-scroll-section.tsx — Sección sticky cuyo contenido se desplaza
// horizontalmente conducido por el scroll vertical.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El root define el recorrido (altura = 100dvh + travel px), un inner sticky
// fija el viewport de la fila, y un listener pasivo de scroll (coalescido por
// RAF) escribe --hscroll-progress (0→1) como CSS var; el desplazamiento es un
// translateX(calc(...)) compositado — sin React state por frame. El scroll es
// reversible. Con prefers-reduced-motion los paneles se apilan verticalmente.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef, useState } from 'react'

const PANELS = ['Uno', 'Dos', 'Tres', 'Cuatro']
const COLORS = ['#1e1b4b', '#0c4a6e', '#14532d', '#7c2d12']

export default function HorizontalScrollDemo() {
  const rootRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const [travel, setTravel] = useState(0)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const row = rowRef.current
    if (!root || !row || reduce) return

    // Recorrido = ancho real de la fila − viewport (medido, no por frame).
    const measure = () => setTravel(Math.max(0, row.scrollWidth - window.innerWidth))
    measure()

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const rect = root.getBoundingClientRect()
        const range = root.offsetHeight - window.innerHeight
        const progress = range > 0 ? Math.max(0, Math.min(1, -rect.top / range)) : 0
        root.style.setProperty('--hscroll-progress', String(progress))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce, travel])

  if (reduce) {
    // Reduced motion: paneles apilados, alcanzables con scroll normal.
    return (
      <div>
        {PANELS.map((label, i) => (
          <section
            key={label}
            style={{ height: '100dvh', display: 'grid', placeItems: 'center', background: COLORS[i], color: '#fff' }}
          >
            <h2>{label}</h2>
          </section>
        ))}
      </div>
    )
  }

  return (
    <div>
      <section style={{ height: '100dvh', display: 'grid', placeItems: 'center', background: '#0a0a12', color: '#888' }}>
        Scrolleá ↓
      </section>

      <div ref={rootRef} style={{ position: 'relative', height: `calc(100dvh + ${travel}px)` }}>
        <div style={{ position: 'sticky', top: 0, height: '100dvh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <div
            ref={rowRef}
            style={{
              display: 'flex',
              width: 'max-content',
              willChange: 'transform',
              transform: `translateX(calc(var(--hscroll-progress, 0) * ${-travel}px))`,
            }}
          >
            {PANELS.map((label, i) => (
              <section
                key={label}
                style={{ width: '100vw', height: '100dvh', display: 'grid', placeItems: 'center', background: COLORS[i], color: '#fff' }}
              >
                <h2>{label}</h2>
              </section>
            ))}
          </div>
        </div>
      </div>

      <section style={{ height: '100dvh', display: 'grid', placeItems: 'center', background: '#0a0a12', color: '#888' }}>
        Fin
      </section>
    </div>
  )
}
