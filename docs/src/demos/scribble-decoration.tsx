import { useState } from 'react'
import { ScribbleDecoration } from '@fethabo/animated-ui/scribble-decoration'
import type { DemoControl } from '../content'

export default function ScribbleDecorationDemo(props: Record<string, unknown>) {
  const [n, setN] = useState(0)
  // La key incluye las props: cambiar un control re-monta y re-dibuja.
  const key = `${n}-${JSON.stringify(props)}`
  return (
    <div className="docs-demo-stage">
      {/* La palabra es una caja inline-block relativa y con tamaño real; el
          garabato la cubre como overlay absoluto (inset negativo para rodearla)
          y así el ResizeObserver del componente mide la caja correcta. */}
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          fontSize: '2.4rem',
          fontWeight: 700,
          padding: '0.15em 0.35em',
        }}
      >
        important
        <ScribbleDecoration
          key={key}
          shape="circle"
          color="#7c3aed"
          trigger="mount"
          strokeWidth={3}
          {...props}
          style={{ position: 'absolute', inset: -10 }}
        />
      </span>
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
  {
    prop: 'shape',
    type: 'enum',
    options: ['arrow', 'asterisk', 'spiral', 'underline', 'circle'],
    default: 'circle',
  },
  { prop: 'color', type: 'color', default: '#7c3aed' },
  { prop: 'strokeWidth', type: 'number', min: 1, max: 8, step: 1, default: 3 },
  { prop: 'duration', type: 'number', min: 0.2, max: 2, step: 0.1, default: 0.9 },
  { prop: 'delay', type: 'number', min: 0, max: 2, step: 0.1, default: 0 },
  { prop: 'trigger', type: 'enum', options: ['in-view', 'mount'], default: 'mount' },
  { prop: 'once', type: 'boolean', default: true },
  { prop: 'repeat', type: 'boolean', default: false },
]
