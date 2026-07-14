import { CursorTrail } from '@fethabo/animated-ui/cursor-trail'
import type { DemoControl } from '../content'

export default function CursorTrailDemo(props: Record<string, unknown>) {
  return (
    <CursorTrail
      mode="line"
      color="#0ea5e9"
      colors={['#0ea5e9', '#7c3aed', '#22d3ee']}
      size={10}
      {...props}
      style={{
        minHeight: 340,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 12,
        background: '#0a0a12',
      }}
    >
      <p style={{ margin: 0, opacity: 0.65 }}>move your cursor around</p>
    </CursorTrail>
  )
}

export const controls: DemoControl[] = [
  { prop: 'mode', type: 'enum', options: ['particles', 'line'], default: 'line' },
  { prop: 'size', type: 'number', min: 2, max: 30, step: 1, default: 10 },
  { prop: 'length', type: 'number', min: 4, max: 40, step: 1, default: 15 },
  { prop: 'life', type: 'number', min: 100, max: 1500, step: 50, default: 500 },
  { prop: 'emitEvery', type: 'number', min: 1, max: 60, step: 1, default: 16 },
  { prop: 'color', type: 'color', default: '#0ea5e9' },
  {
    prop: 'colors',
    type: 'multi',
    asColors: true,
    options: ['#0ea5e9', '#7c3aed', '#22d3ee', '#ec4899', '#10b981', '#f59e0b', '#a78bfa'],
    default: ['#0ea5e9', '#7c3aed', '#22d3ee'],
  },
]
