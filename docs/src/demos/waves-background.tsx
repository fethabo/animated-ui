import { WavesBackground } from '@fethabo/animated-ui/waves-background'
import type { DemoControl } from '../content'

export default function WavesBackgroundDemo(props: Record<string, unknown>) {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <WavesBackground lines={26} amplitude={28} colors={['#22d3ee', '#a78bfa']} {...props} />
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'lines', type: 'number', min: 6, max: 60, step: 2, default: 26 },
  { prop: 'amplitude', type: 'number', min: 0, max: 80, step: 2, default: 28 },
  { prop: 'speed', type: 'number', min: 0, max: 4, step: 0.25, default: 1 },
  { prop: 'lineWidth', type: 'number', min: 0.5, max: 6, step: 0.5, default: 1.5 },
  {
    prop: 'colors',
    type: 'multi',
    asColors: true,
    options: ['#22d3ee', '#a78bfa', '#7c3aed', '#0ea5e9', '#10b981', '#ec4899', '#f59e0b'],
    default: ['#22d3ee', '#a78bfa'],
  },
]
