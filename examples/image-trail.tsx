// image-trail.tsx — Imágenes efímeras que brotan siguiendo el puntero y se
// desvanecen (efecto agency/portfolio).
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Cada vez que el recorrido del puntero supera EMIT_EVERY px se crea un <img>
// en el punto actual (rotando el pool IMAGES en orden cíclico, con un cap de
// nodos vivos); el nodo anima con keyframes CSS (pop + flotado + fade) y se
// remueve solo del DOM en animationend — sin estado de React por imagen. Las
// URLs se precargan al montar. Con prefers-reduced-motion no se emite nada.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const IMAGES = [
  'https://picsum.photos/id/1015/300/200',
  'https://picsum.photos/id/1025/300/200',
  'https://picsum.photos/id/1035/300/200',
  'https://picsum.photos/id/1045/300/200',
]
const SIZE = 140 // ancho máximo en px
const EMIT_EVERY = 80 // px de recorrido entre imágenes
const DURATION = 900 // ms
const MAX_CONCURRENT = 8

const CSS = `
.it-img {
  position: absolute;
  width: ${SIZE}px;
  height: auto;
  border-radius: 12px;
  animation: it-pop ${DURATION}ms ease-out forwards;
  will-change: transform, opacity;
}
@keyframes it-pop {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.4) rotate(var(--rot, 0deg)); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -65%) scale(1) rotate(var(--rot, 0deg)); }
}
`

export default function ImageTrailDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!document.getElementById('it-styles')) {
      const style = document.createElement('style')
      style.id = 'it-styles'
      style.textContent = CSS
      document.head.appendChild(style)
    }
    // Precarga: sin jank de decode en la primera emisión.
    for (const src of IMAGES) {
      const img = new Image()
      img.src = src
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const layer = layerRef.current
    if (!container || !layer) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let last: { x: number; y: number } | null = null
    let traveled = 0
    let nextIndex = 0

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = container.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (!last) {
        last = { x, y }
        return
      }
      traveled += Math.hypot(x - last.x, y - last.y)
      last = { x, y }
      if (traveled < EMIT_EVERY || layer.childElementCount >= MAX_CONCURRENT) return
      traveled = 0

      const img = document.createElement('img')
      img.className = 'it-img'
      img.src = IMAGES[nextIndex]
      img.alt = ''
      img.style.left = `${x}px`
      img.style.top = `${y}px`
      img.style.setProperty('--rot', `${(Math.random() * 24 - 12).toFixed(1)}deg`)
      img.addEventListener('animationend', () => img.remove())
      layer.appendChild(img)
      nextIndex = (nextIndex + 1) % IMAGES.length // rotación cíclica del pool
    }
    const onLeave = () => {
      last = null
      traveled = 0
    }

    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerleave', onLeave)
    return () => {
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: 440,
        background: '#0f0f1a',
        color: '#e2e8f0',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'system-ui',
      }}
    >
      <h2>Movete por acá</h2>
      <div
        ref={layerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
