import { RippleContainer } from '@fethabo/animated-ui/ripple-container'
import type { DemoControl } from '../content'

export default function RippleContainerDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <RippleContainer
        color="#ffffff"
        duration={650}
        {...props}
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

export const controls: DemoControl[] = [
  { prop: 'color', type: 'color', default: '#ffffff', override: 'elección del demo para que la prop sea observable; el test-app también diverge del default' },
  { prop: 'duration', type: 'number', min: 200, max: 1500, step: 50, default: 650, override: 'valor propio del demo para que el efecto se lea dentro del frame de la docs (el test-app usa el default de la librería)' },
  { prop: 'opacity', type: 'number', min: 0, max: 1, step: 0.05, default: 0.55, override: 'valor propio del demo para que el efecto se lea dentro del frame de la docs (el test-app usa el default de la librería)' },
  { prop: 'maxRadius', type: 'number', min: 40, max: 600, step: 20, default: 320 },
]
