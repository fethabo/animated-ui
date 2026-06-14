import { useState } from 'react'
import { ImageDissolve } from '@fethabo/animated-ui'

// Genera una imagen same-origin (data URL PNG) con gradiente y número. Los data
// URLs PNG no "taintean" el canvas, así que getImageData funciona y el dithering
// se ve de verdad (sin depender de archivos externos).
function makeImage(label, from, to) {
  const c = document.createElement('canvas')
  c.width = 480
  c.height = 320
  const ctx = c.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, 480, 320)
  grad.addColorStop(0, from)
  grad.addColorStop(1, to)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 480, 320)
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 160px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, 240, 170)
  return c.toDataURL('image/png')
}

// Demo con estado propio: las imágenes son fijas (data URLs) y la navegación
// 1/2/3 se conserva; `duration` y `respectReducedMotion` vienen del panel.
function ImageDissolveView(props) {
  const [index, setIndex] = useState(0)
  const [images] = useState(() => [
    makeImage('1', '#7c3aed', '#22d3ee'),
    makeImage('2', '#f59e0b', '#ef4444'),
    makeImage('3', '#10b981', '#3b82f6'),
  ])
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: 480, maxWidth: '90vw' }}>
        <ImageDissolve {...props} src={images[index]} alt={`Imagen ${index + 1}`} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: '1px solid #444',
              background: i === index ? '#7c3aed' : '#12121f',
              color: '#eee',
              cursor: 'pointer',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default {
  id: 'image-dissolve',
  title: 'ImageDissolve — transición Bayer (clic en los números)',
  height: '80vh',
  controls: [{ prop: 'duration', type: 'number', min: 200, max: 3000, step: 100, default: 1000 }],
  render: (props) => <ImageDissolveView {...props} />,
}
