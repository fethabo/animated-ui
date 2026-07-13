import { useState } from 'react'
import { ScribbleDecoration } from '@fethabo/animated-ui/scribble-decoration'

export default function ScribbleDecorationDemo() {
  const [key, setKey] = useState(0)
  return (
    <div className="docs-demo-stage">
      <span style={{ position: 'relative', fontSize: '2rem', fontWeight: 700, padding: '0 8px' }}>
        important
        <ScribbleDecoration key={key} shape="circle" color="#7c3aed" trigger="mount" strokeWidth={3} />
      </span>
      <button type="button" onClick={() => setKey((k) => k + 1)} style={{ font: 'inherit', fontWeight: 600, padding: '8px 20px', borderRadius: 8, border: '1px solid #2c2c4a', background: 'transparent', color: '#e8e8f0', cursor: 'pointer' }}>
        replay
      </button>
    </div>
  )
}
