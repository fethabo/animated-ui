import { TiltCard } from '@fethabo/animated-ui/tilt-card'

export default function TiltCardDemo() {
  return (
    <div className="docs-demo-stage">
      <TiltCard
        glare
        maxAngle={14}
        style={{
          borderRadius: 16,
          padding: '28px 32px',
          maxWidth: 340,
          background: 'linear-gradient(135deg, #1b1b2f, #12121f)',
          border: '1px solid #2c2c4a',
        }}
      >
        {({ isHovering }) => (
          <>
            <h3 style={{ margin: '0 0 8px' }}>TiltCard</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              {isHovering ? 'tracking the cursor…' : 'hover me'}
            </p>
          </>
        )}
      </TiltCard>
    </div>
  )
}
