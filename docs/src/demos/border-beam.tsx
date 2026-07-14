import { BorderBeam } from '@fethabo/animated-ui/border-beam'
import type { DemoControl } from '../content'

export default function BorderBeamDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <BorderBeam
        duration={6}
        colorFrom="#7c3aed"
        colorTo="#0ea5e9"
        {...props}
        style={{
          borderRadius: 18,
          padding: 28,
          maxWidth: 340,
          background: '#12121f',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h3 style={{ margin: '0 0 8px' }}>Featured card</h3>
        <p style={{ margin: 0, opacity: 0.7 }}>
          The comet traces the perimeter with offset-path, rounded corners included.
        </p>
      </BorderBeam>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'duration', type: 'number', min: 2, max: 16, step: 1, default: 6 },
  { prop: 'size', type: 'number', min: 40, max: 200, step: 10, default: 96 },
  { prop: 'borderWidth', type: 'number', min: 1, max: 6, step: 1, default: 2 },
  { prop: 'delay', type: 'number', min: -10, max: 0, step: 0.5, default: 0 },
  { prop: 'colorFrom', type: 'color', default: '#7c3aed' },
  { prop: 'colorTo', type: 'color', default: '#0ea5e9' },
]
