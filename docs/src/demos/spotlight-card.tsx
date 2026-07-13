import { SpotlightCard } from '@fethabo/animated-ui/spotlight-card'

export default function SpotlightCardDemo() {
  return (
    <div className="docs-demo-stage">
      <SpotlightCard
        color="rgba(14, 165, 233, 0.22)"
        radius={320}
        style={{
          maxWidth: 340,
          padding: '32px 28px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #12121f, #0a0a12)',
          border: '1px solid #2c2c4a',
        }}
      >
        <h3 style={{ margin: '0 0 8px' }}>SpotlightCard</h3>
        <p style={{ margin: 0, opacity: 0.7 }}>
          Move the cursor: the light follows it. This{' '}
          <a href="#spotlight-card" style={{ color: '#7c3aed' }}>link</a> stays clickable.
        </p>
      </SpotlightCard>
    </div>
  )
}
