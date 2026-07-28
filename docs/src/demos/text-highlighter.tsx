import { useState } from 'react'
import { TextHighlighter } from '@fethabo/animated-ui/text-highlighter'
import type { DemoControl } from '../content'

export default function TextHighlighterDemo(props: Record<string, unknown>) {
  const [n, setN] = useState(0)
  const key = `${n}-${JSON.stringify(props)}`

  return (
    <div className="docs-demo-stage">
      <p style={{ fontSize: '1.6rem', lineHeight: 1.7, maxWidth: 420, textAlign: 'center' }}>
        Draw attention to{' '}
        <TextHighlighter key={key} shape="highlight" color="#7c3aed" trigger="mount" {...props}>
          key ideas
        </TextHighlighter>
        .
      </p>
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
    options: ['underline', 'wavy-underline', 'circle', 'highlight', 'strike', 'box'],
    default: 'highlight',
    override: 'valor propio del demo para que el efecto se lea dentro del frame de la docs (el test-app usa el default de la librería)',
  },
  { prop: 'trigger', type: 'enum', options: ['in-view', 'mount', 'hover'], default: 'mount', override: 'el frame del demo ya está en viewport al abrir la vista; con \'in-view\' el efecto puede dispararse antes de que el usuario lo mire' },
  { prop: 'color', type: 'color', default: '#7c3aed', override: 'elección del demo para que la prop sea observable; el test-app también diverge del default' },
  { prop: 'strokeWidth', type: 'number', min: 1, max: 12, step: 1, default: 3 },
  { prop: 'duration', type: 'number', min: 0.2, max: 2, step: 0.1, default: 0.9 },
  { prop: 'delay', type: 'number', min: 0, max: 2, step: 0.1, default: 0 },
  { prop: 'once', type: 'boolean', default: true },
]
