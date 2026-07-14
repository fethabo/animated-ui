import { useState } from 'react'
import { SplitReveal } from '@fethabo/animated-ui/split-reveal'
import type { DemoControl } from '../content'

/** trigger='mount' + re-montaje por key (bumpeada por el botón o por cambiar un
 *  control) para re-ver el reveal con la config elegida. */
export default function SplitRevealDemo(props: Record<string, unknown>) {
  const [n, setN] = useState(0)
  // La key incluye las props: cambiar un control re-monta y re-dispara el reveal.
  const key = `${n}-${JSON.stringify(props)}`

  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2rem', fontWeight: 700 }}>
        <SplitReveal
          key={key}
          text="Revealed word by word"
          split="word"
          preset="slide-up"
          trigger="mount"
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
        replay
      </button>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'split', type: 'enum', options: ['char', 'word', 'line'], default: 'word' },
  { prop: 'preset', type: 'enum', options: ['fade', 'slide-up', 'blur'], default: 'slide-up' },
  { prop: 'stagger', type: 'number', min: 0, max: 0.2, step: 0.01, default: 0.05 },
  { prop: 'duration', type: 'number', min: 0.1, max: 1.5, step: 0.1, default: 0.6 },
  { prop: 'distance', type: 'number', min: 0, max: 60, step: 4, default: 16 },
  { prop: 'threshold', type: 'number', min: 0, max: 1, step: 0.05, default: 0.15 },
  { prop: 'trigger', type: 'enum', options: ['mount', 'in-view'], default: 'mount' },
  { prop: 'once', type: 'boolean', default: true },
]
