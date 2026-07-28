import { TypewriterText } from '@fethabo/animated-ui/typewriter-text'
import type { DemoControl } from '../content'

export default function TypewriterTextDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--docs-mono)' }}>
        <TypewriterText
          text={['Build once.', 'Ship anywhere.', 'Zero config.']}
          loop
          speed={26}
          pauseDuration={1400}
          {...props}
        />
      </div>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'speed', type: 'number', min: 5, max: 80, step: 5, default: 26, override: 'valor propio del demo para que el efecto se lea dentro del frame de la docs (el test-app usa el default de la librería)' },
  { prop: 'deleteSpeed', type: 'number', min: 5, max: 80, step: 5, default: 30 },
  { prop: 'pauseDuration', type: 'number', min: 300, max: 3000, step: 100, default: 1400, override: 'valor propio del demo para que el efecto se lea dentro del frame de la docs (el test-app usa el default de la librería)' },
  { prop: 'startDelay', type: 'number', min: 0, max: 2000, step: 100, default: 0 },
  { prop: 'loop', type: 'boolean', default: true, override: 'prop encendida para que el demo la muestre; apagada por default en la librería' },
]
