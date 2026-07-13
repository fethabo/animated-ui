import { GlitchText } from '@fethabo/animated-ui/glitch-text'

export default function GlitchTextDemo() {
  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2.6rem', fontWeight: 800, letterSpacing: '0.04em' }}>
        <GlitchText trigger="loop" intensity={3} frequency={2}>
          SYSTEM FAILURE
        </GlitchText>
      </div>
      <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>
        <GlitchText trigger="hover" intensity={4}>
          hover me
        </GlitchText>
      </p>
    </div>
  )
}
