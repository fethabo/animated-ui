import { AnimatedBackground } from '@fethabo/animated-ui/animated-background'

export default function AnimatedBackgroundDemo() {
  return (
    <div style={{ position: 'relative', minHeight: 320, overflow: 'hidden', borderRadius: 12 }}>
      <AnimatedBackground
        variant="aurora"
        colors={['#7c3aed', '#0ea5e9', '#10b981', '#ec4899']}
        speed={12}
      />
      <div
        style={{
          position: 'relative',
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 8,
          color: '#f4f4ff',
        }}
      >
        <h3 style={{ margin: 0, fontSize: 28 }}>Aurora</h3>
        <p style={{ margin: 0, opacity: 0.75 }}>
          también: mesh · noise · beam · lava · grid · rays · dots
        </p>
      </div>
    </div>
  )
}
