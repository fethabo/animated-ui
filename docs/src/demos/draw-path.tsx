import { useState } from 'react'
import { DrawPath } from '@fethabo/animated-ui/draw-path'

export default function DrawPathDemo() {
  const [key, setKey] = useState(0)
  return (
    <div className="docs-demo-stage">
      <DrawPath key={key} duration={1.4} stagger={0.2} trigger="mount">
        <svg viewBox="0 0 120 120" width={160} height={160} fill="none" stroke="#7c3aed" strokeWidth={3} strokeLinecap="round">
          <circle cx="60" cy="60" r="46" />
          <path d="M38 62 l16 16 l30 -34" stroke="#0ea5e9" />
        </svg>
      </DrawPath>
      <button type="button" onClick={() => setKey((k) => k + 1)} style={{ font: 'inherit', fontWeight: 600, padding: '8px 20px', borderRadius: 8, border: '1px solid #2c2c4a', background: 'transparent', color: '#e8e8f0', cursor: 'pointer' }}>
        replay
      </button>
    </div>
  )
}
