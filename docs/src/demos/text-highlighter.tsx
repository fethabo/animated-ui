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
  },
  { prop: 'trigger', type: 'enum', options: ['in-view', 'mount', 'hover'], default: 'mount' },
  { prop: 'color', type: 'color', default: '#7c3aed' },
  { prop: 'strokeWidth', type: 'number', min: 1, max: 12, step: 1, default: 3 },
  { prop: 'duration', type: 'number', min: 0.2, max: 2, step: 0.1, default: 0.9 },
  { prop: 'delay', type: 'number', min: 0, max: 2, step: 0.1, default: 0 },
  { prop: 'once', type: 'boolean', default: true },
]
