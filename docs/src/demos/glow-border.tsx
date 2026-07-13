import { GlowBorder } from '@fethabo/animated-ui/glow-border'

export default function GlowBorderDemo() {
  return (
    <div className="docs-demo-stage">
      <GlowBorder
        width={2}
        radius={16}
        colors={['#7c3aed', '#0ea5e9']}
        contentStyle={{
          background: '#12121f',
          padding: '32px 28px',
          maxWidth: 300,
        }}
      >
        <h3 style={{ margin: '0 0 8px' }}>GlowBorder</h3>
        <p style={{ margin: 0, opacity: 0.7 }}>
          A conic gradient rotates around the perimeter.
        </p>
      </GlowBorder>
    </div>
  )
}
