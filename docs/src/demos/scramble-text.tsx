import { ScrambleText } from '@fethabo/animated-ui/scramble-text'

export default function ScrambleTextDemo() {
  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--docs-mono)' }}>
        <ScrambleText text="Decoding transmission…" trigger="both" scrambleColor="#0ea5e9" />
      </div>
      <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>hover para re-scramble</p>
    </div>
  )
}
