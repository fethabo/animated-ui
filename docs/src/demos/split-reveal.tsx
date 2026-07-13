import { useState } from 'react'
import { SplitReveal } from '@fethabo/animated-ui/split-reveal'

/** trigger='mount' + re-montaje por key para poder re-ver el reveal. */
export default function SplitRevealDemo() {
  const [key, setKey] = useState(0)

  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2rem', fontWeight: 700 }}>
        <SplitReveal key={key} text="Revealed word by word" split="word" preset="slide-up" trigger="mount" />
      </div>
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
