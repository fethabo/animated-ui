import { useState } from 'react'
import { ScrambleText } from '@fethabo/animated-ui/scramble-text'
import type { DemoControl } from '../content'

export default function ScrambleTextDemo(props: Record<string, unknown>) {
  const [n, setN] = useState(0)
  const key = `${n}-${JSON.stringify(props)}`
  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--docs-mono)' }}>
        <ScrambleText
          key={key}
          text="Decoding transmission…"
          trigger="both"
          scrambleColor="#0ea5e9"
          {...props}
        />
      </div>
      <button
        type="button"
        onClick={() => setN((k) => k + 1)}
        style={{
          font: 'inherit',
          fontWeight: 600,
          padding: '8px 20px',
          borderRadius: 8,
          border: '1px solid #2c2c4a',
          background: 'transparent',
          color: '#e8e8f0',
          cursor: 'pointer',
        }}
      >
        replay (o hover)
      </button>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'trigger', type: 'enum', options: ['mount', 'hover', 'both'], default: 'both' },
  { prop: 'speed', type: 'number', min: 5, max: 80, step: 5, default: 25 },
  { prop: 'scrambleColor', type: 'color', default: '#0ea5e9' },
]
