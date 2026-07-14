import { useState } from 'react'
import { ImageDissolve } from '@fethabo/animated-ui/image-dissolve'
import type { DemoControl } from '../content'

// Genera una imagen same-origin (data URL PNG) con gradiente y número. Los
// data URLs PNG no "taintean" el canvas, así que `getImageData` funciona y el
// dithering se ve de verdad (a diferencia de un SVG data-URI, que sí lo tainta).
function makeImage(label: string, from: string, to: string): string {
  const c = document.createElement('canvas')
  c.width = 480
  c.height = 300
  const ctx = c.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 480, 300)
  grad.addColorStop(0, from)
  grad.addColorStop(1, to)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 480, 300)
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 150px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, 240, 155)
  return c.toDataURL('image/png')
}

const btn = (active: boolean) => ({
  padding: '0.5rem 1rem',
  borderRadius: 8,
  border: `1px solid ${active ? '#7c3aed' : '#2c2c4a'}`,
  background: active ? '#7c3aed' : '#1e1b2e',
  color: '#e8e8f0',
  cursor: 'pointer',
  font: 'inherit',
  fontWeight: 600,
})

export default function ImageDissolveDemo(props: Record<string, unknown>) {
  const [index, setIndex] = useState(0)
  // Las imágenes son fijas (data URLs generados una sola vez).
  const [images] = useState(() => [
    makeImage('1', '#7c3aed', '#22d3ee'),
    makeImage('2', '#f59e0b', '#ef4444'),
    makeImage('3', '#10b981', '#3b82f6'),
  ])
  return (
    <div className="docs-demo-stage">
      <div style={{ borderRadius: 12, overflow: 'hidden', width: 'min(420px, 90%)' }}>
        <ImageDissolve
          src={images[index]}
          alt={`Imagen ${index + 1}`}
          duration={900}
          {...props}
          style={{ display: 'block', width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {images.map((_, i) => (
          <button key={i} type="button" style={btn(i === index)} onClick={() => setIndex(i)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'duration', type: 'number', min: 200, max: 2000, step: 100, default: 900 },
]
