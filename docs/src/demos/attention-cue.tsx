import { useRef } from 'react'
import { AttentionCue } from '@fethabo/animated-ui/attention-cue'
import type { DemoControl } from '../content'

// Quedate quieto ~2s: la pista de luz aparece apuntando al botón.
export default function AttentionCueDemo(props: Record<string, unknown>) {
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <AttentionCue
      target={ref}
      idleDelay={1600}
      color="#fbbf24"
      {...props}
      className="docs-demo-stage"
      style={{ position: 'relative' }}
    >
      <p style={{ margin: 0, opacity: 0.7 }}>Dejá el mouse quieto un momento…</p>
      <button
        ref={ref}
        style={{
          font: 'inherit',
          fontWeight: 600,
          padding: '10px 24px',
          borderRadius: 10,
          border: 'none',
          background: '#7c3aed',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        acá
      </button>
    </AttentionCue>
  )
}

export const controls: DemoControl[] = [
  { prop: 'marker', type: 'enum', options: ['beam', 'footprints'], default: 'beam' },
  { prop: 'head', type: 'enum', options: ['arrow', 'dot', 'none'], default: 'arrow' },
  { prop: 'idleDelay', type: 'number', min: 500, max: 4000, step: 100, default: 1600 },
  { prop: 'duration', type: 'number', min: 200, max: 2000, step: 100, default: 700 },
  { prop: 'speed', type: 'number', min: 100, max: 900, step: 20, default: 420 },
  { prop: 'maxDistance', type: 'number', min: 80, max: 500, step: 20, default: 220 },
  { prop: 'lineWidth', type: 'number', min: 1, max: 8, step: 0.5, default: 3 },
  { prop: 'curve', type: 'number', min: 0, max: 1, step: 0.1, default: 0 },
  { prop: 'showGuide', type: 'boolean', default: false },
  { prop: 'color', type: 'color', default: '#fbbf24' },
]

