import { BorderBeam } from '@fethabo/animated-ui/border-beam'

export default function BorderBeamDemo() {
  return (
    <div className="docs-demo-stage">
      <BorderBeam
        duration={6}
        colorFrom="#7c3aed"
        colorTo="#0ea5e9"
        style={{
          borderRadius: 18,
          padding: 28,
          maxWidth: 340,
          background: '#12121f',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h3 style={{ margin: '0 0 8px' }}>Featured card</h3>
        <p style={{ margin: 0, opacity: 0.7 }}>
          The comet traces the perimeter with offset-path, rounded corners included.
        </p>
      </BorderBeam>
    </div>
  )
}
