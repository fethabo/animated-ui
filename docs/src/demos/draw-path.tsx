import { useState } from 'react'
import { DrawPath } from '@fethabo/animated-ui/draw-path'
import type { DemoControl } from '../content'

export default function DrawPathDemo(props: Record<string, unknown>) {
  const [n, setN] = useState(0)
  const key = `${n}-${JSON.stringify(props)}`
  return (
    <div className="docs-demo-stage">
      <DrawPath key={key} duration={1.4} stagger={0.2} trigger="mount" {...props}>
        <svg
          viewBox="0 0 120 120"
          width={160}
          height={160}
          fill="none"
          stroke="#7c3aed"
          strokeWidth={3}
          strokeLinecap="round"
        >
          <circle cx="60" cy="60" r="46" />
          <path d="M38 62 l16 16 l30 -34" stroke="#0ea5e9" />
        </svg>
      </DrawPath>
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
  { prop: 'duration', type: 'number', min: 0.3, max: 3, step: 0.1, default: 1.4 },
  { prop: 'stagger', type: 'number', min: 0, max: 0.6, step: 0.05, default: 0.2 },
  { prop: 'delay', type: 'number', min: 0, max: 2, step: 0.1, default: 0 },
  { prop: 'threshold', type: 'number', min: 0, max: 1, step: 0.05, default: 0.15 },
  { prop: 'trigger', type: 'enum', options: ['in-view', 'mount'], default: 'mount' },
  { prop: 'once', type: 'boolean', default: true },
]
