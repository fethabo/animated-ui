import { FlowField } from '@fethabo/animated-ui/flow-field'
import type { DemoControl } from '../content'

export default function FlowFieldDemo(props: Record<string, unknown>) {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <FlowField
        count={500}
        colors={['#22d3ee', '#a78bfa', '#f472b6']}
        background="#0a0a12"
        {...props}
      />
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'count', type: 'number', min: 50, max: 1000, step: 50, default: 500 },
  { prop: 'speed', type: 'number', min: 0.2, max: 4, step: 0.2, default: 1 },
  { prop: 'scale', type: 'number', min: 50, max: 400, step: 10, default: 200 },
  { prop: 'fade', type: 'number', min: 0.8, max: 0.99, step: 0.01, default: 0.95 },
  { prop: 'background', type: 'color', default: '#0a0a12' },
  {
    prop: 'colors',
    type: 'multi',
    asColors: true,
    options: ['#22d3ee', '#a78bfa', '#f472b6', '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b'],
    default: ['#22d3ee', '#a78bfa', '#f472b6'],
  },
]
