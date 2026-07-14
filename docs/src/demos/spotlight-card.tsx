import { SpotlightCard } from '@fethabo/animated-ui/spotlight-card'
import type { DemoControl } from '../content'

export default function SpotlightCardDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <SpotlightCard
        color="#0ea5e9"
        radius={320}
        {...props}
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
          <a href="#spotlight-card" style={{ color: '#7c3aed' }}>
            link
          </a>{' '}
          stays clickable.
        </p>
      </SpotlightCard>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'color', type: 'color', default: '#0ea5e9' },
  { prop: 'radius', type: 'number', min: 100, max: 600, step: 20, default: 320 },
  { prop: 'opacity', type: 'number', min: 0, max: 1, step: 0.05, default: 0.15 },
]
