// mouse-parallax.tsx — Capas con profundidad que siguen al mouse (sin scroll).
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El contenedor escribe dos CSS custom properties por mousemove (sin estado
// de React, sin re-renders); cada capa se traslada con calc() puro según su
// profundidad, suavizada por una transition del compositor. depth negativo
// se mueve en dirección opuesta al mouse.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de
// tipo inline (`: number`, `: ReactNode`).

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

const STYLE_ID = 'mouse-parallax-demo-styles'
const CSS = `
.parallax-demo-layer {
  translate: calc(var(--px, 0) * var(--depth, 20px)) calc(var(--py, 0) * var(--depth, 20px));
  transition: translate 0.2s ease-out;
  will-change: translate;
}
@media (prefers-reduced-motion: reduce) {
  .parallax-demo-layer { translate: 0 0; }
}
`

function Layer({ depth, children }: { depth: number; children?: ReactNode }) {
  return (
    <div className="parallax-demo-layer" style={{ '--depth': `${depth}px` } as CSSProperties}>
      {children}
    </div>
  )
}

function MouseParallax({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={(event) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        // Normalizado a [-1, 1] respecto del centro del contenedor.
        el.style.setProperty('--px', String(((event.clientX - rect.left) / rect.width) * 2 - 1))
        el.style.setProperty('--py', String(((event.clientY - rect.top) / rect.height) * 2 - 1))
      }}
      onMouseLeave={() => {
        ref.current?.style.setProperty('--px', '0')
        ref.current?.style.setProperty('--py', '0')
      }}
      style={{ position: 'relative', display: 'grid', placeItems: 'center', minHeight: '60vh' }}
    >
      {children}
    </div>
  )
}

export default function MouseParallaxDemo() {
  return (
    <div style={{ background: '#050510', color: '#eee' }}>
      <MouseParallax>
        <Layer depth={40}>
          <div style={{ fontSize: '5rem', opacity: 0.25 }}>✦ ✦ ✦</div>
        </Layer>
        <Layer depth={-20}>
          <h1 style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', margin: 0 }}>
            Mové el mouse
          </h1>
        </Layer>
      </MouseParallax>
    </div>
  )
}
