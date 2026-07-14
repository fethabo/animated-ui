import { StarfieldBackground } from '@fethabo/animated-ui/starfield-background'
import type { DemoControl } from '../content'

export default function StarfieldBackgroundDemo(props: Record<string, unknown>) {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <StarfieldBackground density={1.2} shootingStars={12} {...props} />
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'density', type: 'number', min: 0.2, max: 3, step: 0.1, default: 1.2 },
  { prop: 'shootingStars', type: 'number', min: 0, max: 40, step: 2, default: 12 },
  { prop: 'speed', type: 'number', min: 0, max: 4, step: 0.25, default: 1 },
  { prop: 'fixed', type: 'boolean', default: false },
  { prop: 'background', type: 'color', default: '#050514' },
  {
    prop: 'colors',
    type: 'multi',
    asColors: true,
    options: ['#ffffff', '#bfdbfe', '#fde68a', '#a78bfa', '#22d3ee', '#f472b6'],
    default: ['#ffffff', '#bfdbfe', '#fde68a'],
  },
]
