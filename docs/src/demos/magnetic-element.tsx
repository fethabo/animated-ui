import { MagneticElement } from '@fethabo/animated-ui/magnetic-element'
import type { DemoControl } from '../content'

export default function MagneticElementDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <MagneticElement strength={0.45} hitArea={60} {...props}>
        {({ isActive }) => (
          <div
            style={{
              padding: '18px 32px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #1b1b2f, #12121f)',
              border: `1px solid ${isActive ? '#7c3aed' : '#2c2c4a'}`,
              textAlign: 'center',
              transition: 'border-color 200ms',
            }}
          >
            <strong>Catch me</strong>
            <p style={{ margin: '4px 0 0', opacity: 0.7 }}>
              {isActive ? 'pulling toward the cursor…' : 'come closer'}
            </p>
          </div>
        )}
      </MagneticElement>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'strength', type: 'number', min: 0, max: 1, step: 0.05, default: 0.45 },
  { prop: 'hitArea', type: 'number', min: 0, max: 160, step: 10, default: 60 },
]
