import { RippleContainer } from '@fethabo/animated-ui/ripple-container'

export default function RippleContainerDemo() {
  return (
    <div className="docs-demo-stage">
      <RippleContainer
        color="rgba(255,255,255,0.55)"
        duration={650}
        style={{
          width: 320,
          height: 180,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <p style={{ margin: 0 }}>Click anywhere — rapid clicks stack ripples</p>
      </RippleContainer>
    </div>
  )
}
