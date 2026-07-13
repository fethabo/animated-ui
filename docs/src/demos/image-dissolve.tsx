import { useState } from 'react'
import { ImageDissolve } from '@fethabo/animated-ui/image-dissolve'

// Dos imágenes generadas como data-URI SVG (sin requests externas).
const svg = (a: string, b: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='480' height='300' fill='url(#g)'/></svg>`,
  )

const A = svg('#7c3aed', '#0ea5e9')
const B = svg('#f59e0b', '#ef4444')

export default function ImageDissolveDemo() {
  const [src, setSrc] = useState(A)
  return (
    <div className="docs-demo-stage">
      <div style={{ borderRadius: 12, overflow: 'hidden', width: 'min(420px, 90%)' }}>
        <ImageDissolve src={src} alt="Demo gradient" duration={900} style={{ display: 'block', width: '100%' }} />
      </div>
      <button
        type="button"
        onClick={() => setSrc((s) => (s === A ? B : A))}
        style={{ font: 'inherit', fontWeight: 600, padding: '8px 20px', borderRadius: 8, border: '1px solid #2c2c4a', background: 'transparent', color: '#e8e8f0', cursor: 'pointer' }}
      >
        dissolve
      </button>
    </div>
  )
}
