// ripple-container.tsx — Onda expansiva desde el punto de click (material
// ripple), con nodos efímeros autolimpiados.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Cada pointerdown crea un span posicionado en el punto del click cuyo radio
// llega a la esquina más lejana del contenedor; el span se anima con CSS
// (scale 0→1 + fade) y se remueve del DOM en animationend — sin estado de
// React por onda, así los clicks rápidos generan ondas concurrentes. La capa
// de ondas es pointer-events: none: no intercepta los clicks del contenido.
// Con prefers-reduced-motion la onda no se expande (solo fade en el punto).
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const COLOR = 'rgba(255, 255, 255, 0.5)'
const DURATION = 600 // ms

const CSS = `
.ripple-wave {
  position: absolute;
  border-radius: 50%;
  background: ${COLOR};
  transform: scale(0);
  animation: ripple-expand ${DURATION}ms ease-out forwards;
  will-change: transform, opacity;
}
@keyframes ripple-expand {
  from { transform: scale(0); opacity: 1; }
  to { transform: scale(1); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ripple-wave {
    transform: scale(1);
    animation: ripple-fade ${DURATION}ms ease-out forwards;
  }
  @keyframes ripple-fade {
    from { opacity: 1; }
    to { opacity: 0; }
  }
}
`

export default function RippleContainerDemo() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (document.getElementById('ripple-demo-css')) return
    const style = document.createElement('style')
    style.id = 'ripple-demo-css'
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  const spawnWave = (event: React.PointerEvent<HTMLDivElement>) => {
    const layer = layerRef.current
    if (!layer) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    // El radio llega a la esquina más lejana: la onda cubre el contenedor.
    const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y))

    const wave = document.createElement('span')
    wave.className = 'ripple-wave'
    wave.style.left = `${x - radius}px`
    wave.style.top = `${y - radius}px`
    wave.style.width = `${radius * 2}px`
    wave.style.height = `${radius * 2}px`
    wave.addEventListener('animationend', () => wave.remove())
    layer.appendChild(wave)
  }

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '50vh', background: '#0a0a12' }}>
      <div
        onPointerDown={spawnWave}
        style={{
          position: 'relative',
          padding: '2rem 4rem',
          borderRadius: 16,
          background: '#7c3aed',
          color: '#fff',
          fontFamily: 'system-ui',
          fontSize: '1.2rem',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        Click en cualquier punto
        {/* Capa de ondas: recortada al contenedor, nunca intercepta clicks. */}
        <div
          ref={layerRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            borderRadius: 'inherit',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}
