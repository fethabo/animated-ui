import { CircuitBackground } from '@fethabo/animated-ui/circuit-background'
import type { DemoControl } from '../content'

export default function CircuitBackgroundDemo(props: Record<string, unknown>) {
  return (
    <div style={{ position: 'relative', minHeight: 320, background: '#050b16' }}>
      <CircuitBackground trackColor="#1e3a5f" pulseColor="#22d3ee" pulseCount={10} {...props} />
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'density', type: 'number', min: 0.5, max: 3, step: 0.25, default: 1 },
  { prop: 'pulseCount', type: 'number', min: 1, max: 30, step: 1, default: 10 },
  { prop: 'pulseSpeed', type: 'number', min: 20, max: 240, step: 10, default: 90 },
  { prop: 'lineWidth', type: 'number', min: 1, max: 6, step: 0.5, default: 2 },
  { prop: 'trackColor', type: 'color', default: '#1e3a5f' },
  { prop: 'pulseColor', type: 'color', default: '#22d3ee' },
]
