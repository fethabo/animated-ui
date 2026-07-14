import { TopographicBackground } from '@fethabo/animated-ui/topographic-background'
import type { DemoControl } from '../content'

export default function TopographicBackgroundDemo(props: Record<string, unknown>) {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <TopographicBackground levels={12} color="#38bdf8" scale={220} {...props} />
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'levels', type: 'number', min: 3, max: 24, step: 1, default: 12 },
  { prop: 'lineWidth', type: 'number', min: 0.5, max: 4, step: 0.5, default: 1 },
  { prop: 'scale', type: 'number', min: 80, max: 400, step: 10, default: 220 },
  { prop: 'speed', type: 'number', min: 0, max: 4, step: 0.25, default: 1 },
  { prop: 'color', type: 'color', default: '#38bdf8' },
]
