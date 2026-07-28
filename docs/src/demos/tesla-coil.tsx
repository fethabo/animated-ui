import { TeslaCoil } from '@fethabo/animated-ui/tesla-coil'
import type { DemoControl } from '../content'

export default function TeslaCoilDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          height: 300,
          borderRadius: 16,
          overflow: 'hidden',
          background: '#05060f',
          border: '1px solid #2c2c4a',
        }}
      >
        <TeslaCoil color="#7dd3fc" boltCount={9} reach={180} cursorBolts={3} {...props}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 20,
            }}
          >
            <span style={{ opacity: 0.7 }}>move the cursor over the coil</span>
          </div>
        </TeslaCoil>
      </div>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'boltCount', type: 'number', min: 1, max: 20, step: 1, default: 9, override: 'elección del demo para que la prop sea observable; el test-app también diverge del default' },
  { prop: 'reach', type: 'number', min: 60, max: 320, step: 10, default: 180, override: 'elección del demo para que la prop sea observable; el test-app también diverge del default' },
  { prop: 'cursorBolts', type: 'number', min: 0, max: 8, step: 1, default: 3 },
  { prop: 'cursorTrigger', type: 'enum', options: ['hover', 'click'], default: 'hover' },
  { prop: 'followCursor', type: 'boolean', default: true },
  // `frequency` son regeneraciones POR SEGUNDO de los rayos ambientales
  // (default 12), no un multiplicador. El rango sigue al del test-app.
  { prop: 'frequency', type: 'number', min: 2, max: 30, step: 1, default: 12 },
  { prop: 'jitter', type: 'number', min: 0, max: 20, step: 1, default: 18 },
  { prop: 'lineWidth', type: 'number', min: 0.5, max: 4, step: 0.5, default: 2 },
  { prop: 'color', type: 'color', default: '#7dd3fc' },
]
