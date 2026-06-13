// sticky-scenes.tsx — Escenas sticky que transicionan durante el scroll.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El contenedor exterior mide 100dvh + nScenes × sceneDuration; el inner
// wrapper es position: sticky (queda fijo mientras se scrollea el rango). Un
// listener pasivo de scroll (coalescido por RAF) calcula el progreso, lo
// descompone en escena activa + progreso dentro de ella, y lo escribe como
// --aui-scene-index / --aui-scene-progress sobre el inner wrapper (sin estado
// de React: scrollear no re-renderiza). Cada escena recibe data-aui-active.
// La escena 2 usa --aui-scene-progress con calc() para interpolar.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef, type ReactNode } from 'react'

const SCENE_DURATION = 600 // px de scroll por escena

const CSS = `
.ss-inner { position: sticky; top: 0; height: 100dvh; overflow: hidden; }
.ss-scene {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.ss-scene[data-aui-active] { opacity: 1; transform: scale(1); }
@media (prefers-reduced-motion: reduce) {
  .ss-scene { transition: none; }
}
`

function StickyScenes({ children }: { children: ReactNode[] }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const nScenes = children.length

  useEffect(() => {
    if (!document.getElementById('ss-demo-styles')) {
      const style = document.createElement('style')
      style.id = 'ss-demo-styles'
      style.textContent = CSS
      document.head.appendChild(style)
    }

    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    const scenes = inner.querySelectorAll<HTMLElement>('.ss-scene')

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const rect = outer.getBoundingClientRect()
        const scrollable = outer.offsetHeight - window.innerHeight
        const progress = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0

        const scaled = progress * nScenes
        let sceneIndex = Math.floor(scaled)
        if (sceneIndex >= nScenes) sceneIndex = nScenes - 1
        const sceneProgress = Math.max(0, Math.min(1, scaled - sceneIndex))

        inner.style.setProperty('--aui-scene-index', String(sceneIndex))
        inner.style.setProperty('--aui-scene-progress', String(sceneProgress))
        scenes.forEach((scene, i) => {
          if (i === sceneIndex) scene.setAttribute('data-aui-active', 'true')
          else scene.removeAttribute('data-aui-active')
        })
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
  }, [nScenes])

  return (
    <div ref={outerRef} style={{ height: `calc(100dvh + ${nScenes * SCENE_DURATION}px)` }}>
      <div ref={innerRef} className="ss-inner">
        {children.map((child, i) => (
          <div key={i} className="ss-scene">
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StickyScenesDemo() {
  return (
    <div style={{ background: '#050510', color: '#eee', fontFamily: 'system-ui' }}>
      <div style={{ height: '50vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Scrolleá ↓</p>
      </div>

      <StickyScenes>
        <h1 style={{ fontSize: '4rem' }}>Escena uno</h1>

        {/* Escena 2: interpola con --aui-scene-progress via calc() puro. */}
        <h1
          style={{
            fontSize: '4rem',
            // El brillo y el desplazamiento siguen el progreso dentro de la escena.
            transform: 'translateY(calc((1 - var(--aui-scene-progress, 0)) * 40px))',
            color: 'hsl(calc(var(--aui-scene-progress, 0) * 280), 80%, 70%)',
          }}
        >
          Escena dos (interpolada)
        </h1>

        <h1 style={{ fontSize: '4rem' }}>Escena tres</h1>
      </StickyScenes>

      <div style={{ height: '50vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Fin</p>
      </div>
    </div>
  )
}
