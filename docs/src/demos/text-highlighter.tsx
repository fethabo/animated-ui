import { useState } from 'react'
import { TextHighlighter } from '@fethabo/animated-ui/text-highlighter'

export default function TextHighlighterDemo() {
  const [key, setKey] = useState(0)

  return (
    <div className="docs-demo-stage">
      <p style={{ fontSize: '1.6rem', lineHeight: 1.7, maxWidth: 420, textAlign: 'center' }}>
        Draw attention to{' '}
        <TextHighlighter key={`a${key}`} shape="highlight" color="#7c3aed" trigger="mount">
          key ideas
        </TextHighlighter>{' '}
        and{' '}
        <TextHighlighter key={`b${key}`} shape="circle" color="#0ea5e9" trigger="mount" delay={0.4}>
          conclusions
        </TextHighlighter>
        .
      </p>
      <button
        type="button"
        onClick={() => setKey((k) => k + 1)}
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
