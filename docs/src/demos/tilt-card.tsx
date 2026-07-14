import { TiltCard } from '@fethabo/animated-ui/tilt-card'
import type { DemoControl } from '../content'

// El estilo de la card va en un <div> HIJO: el TiltCard aplica el tilt a un
// wrapper interno que envuelve children y el perspective al root, así que si
// se estila el root, el tilt/glare toma como referencia el contenido y no la
// card. El root queda mínimo (position: relative), como en el test-app.
const card: React.CSSProperties = {
  width: 320,
  padding: '2.5rem 2rem',
  borderRadius: 16,
  background: 'linear-gradient(135deg, #1b1b2f, #12121f)',
  border: '1px solid #2c2c4a',
  textAlign: 'center',
}

export default function TiltCardDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <TiltCard {...props} style={{ position: 'relative' }}>
        {({ isHovering }) => (
          <div style={card}>
            <h3 style={{ margin: '0 0 8px' }}>TiltCard</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              {isHovering ? 'tracking the cursor…' : 'hover me'}
            </p>
          </div>
        )}
      </TiltCard>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'glare', type: 'boolean', default: true },
  { prop: 'maxAngle', type: 'number', min: 0, max: 30, step: 1, default: 14 },
  { prop: 'perspective', type: 'number', min: 300, max: 2000, step: 50, default: 1000 },
]
