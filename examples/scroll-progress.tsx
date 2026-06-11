// scroll-progress.tsx — Barra de progreso de lectura de la página.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Un listener pasivo de scroll (coalescido por requestAnimationFrame)
// escribe el progreso [0, 1] como CSS custom property; la barra avanza con
// transform: scaleX (compositado, sin relayout). Sin estado de React.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const COLOR = '#7c3aed'
const HEIGHT = 3 // px

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        el.style.setProperty('--progress', String(max > 0 ? Math.min(1, window.scrollY / max) : 0))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, height: HEIGHT, pointerEvents: 'none', zIndex: 50 }}
    >
      <div
        style={{
          height: '100%',
          background: COLOR,
          transform: 'scaleX(var(--progress, 0))',
          transformOrigin: 'left',
          willChange: 'transform',
        }}
      />
    </div>
  )
}

export default function ScrollProgressDemo() {
  return (
    <div style={{ background: '#050510', color: '#eee' }}>
      <ScrollProgress />
      {Array.from({ length: 8 }, (_, i) => (
        <section key={i} style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
          <p style={{ opacity: 0.6 }}>Sección {i + 1} — la barra de arriba marca cuánto leíste.</p>
        </section>
      ))}
    </div>
  )
}
