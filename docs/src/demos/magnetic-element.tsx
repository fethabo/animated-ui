import { MagneticElement } from '@fethabo/animated-ui/magnetic-element'

export default function MagneticElementDemo() {
  return (
    <div className="docs-demo-stage">
      <MagneticElement strength={0.45} hitArea={60}>
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
