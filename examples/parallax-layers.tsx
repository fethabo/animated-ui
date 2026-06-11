// parallax-layers.tsx — Capas con profundidad ligadas a la posición de scroll.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Un listener pasivo de scroll (coalescido por requestAnimationFrame) escribe
// el progreso del contenedor por el viewport ([-1, 1]) como CSS custom
// property; cada capa se traslada con calc() puro según su profundidad.
// Sin estado de React: scrollear no re-renderiza nada.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de
// tipo inline (`: number`, `: ReactNode`).

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

const STYLE_ID = 'parallax-layers-demo-styles'
const CSS = `
.plx-demo-layer {
  translate: 0 calc(var(--plx, 0) * var(--depth, 40px));
  will-change: translate;
}
@media (prefers-reduced-motion: reduce) {
  .plx-demo-layer { translate: 0 0; }
}
`

function Layer({ depth, children }: { depth: number; children?: ReactNode }) {
  return (
    <div className="plx-demo-layer" style={{ '--depth': `${depth}px` } as CSSProperties}>
      {children}
    </div>
  )
}

function ParallaxLayers({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = CSS
      document.head.appendChild(style)
    }

    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const rect = el.getBoundingClientRect()
        // Progreso del contenedor por el viewport: -1 asomando, 0 centrado, 1 saliendo.
        const range = (window.innerHeight + rect.height) / 2
        const advance = window.innerHeight / 2 - rect.top - rect.height / 2
        el.style.setProperty('--plx', String(Math.max(-1, Math.min(1, advance / range))))
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
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  )
}

export default function ParallaxLayersDemo() {
  return (
    <div style={{ background: '#050510', color: '#eee' }}>
      <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Scrolleá ↓</p>
      </div>
      <ParallaxLayers>
        <Layer depth={80}>
          {/* La capa de fondo se sobredimensiona para no dejar huecos al desplazarse. */}
          <div style={{ margin: '-10% 0', fontSize: '6rem', opacity: 0.2, textAlign: 'center' }}>
            ✦ ✦ ✦ ✦ ✦
          </div>
        </Layer>
        <Layer depth={-30}>
          <h1 style={{ textAlign: 'center', padding: '4rem 0' }}>Las capas se mueven a distinta velocidad</h1>
        </Layer>
      </ParallaxLayers>
      <div style={{ height: '100vh' }} />
    </div>
  )
}
