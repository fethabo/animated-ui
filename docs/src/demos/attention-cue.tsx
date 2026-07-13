import { useRef } from 'react'
import { AttentionCue } from '@fethabo/animated-ui/attention-cue'

// Quedate quieto ~2s: la pista de luz aparece apuntando al botón.
export default function AttentionCueDemo() {
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <AttentionCue target={ref} idleDelay={1600} color="#fbbf24" className="docs-demo-stage" style={{ position: 'relative' }}>
      <p style={{ margin: 0, opacity: 0.7 }}>Dejá el mouse quieto un momento…</p>
      <button ref={ref} style={{ font: 'inherit', fontWeight: 600, padding: '10px 24px', borderRadius: 10, border: 'none', background: '#7c3aed', color: '#fff', cursor: 'pointer' }}>
        acá
      </button>
    </AttentionCue>
  )
}
