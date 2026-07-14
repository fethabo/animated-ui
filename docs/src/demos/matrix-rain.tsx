import { MatrixRain } from '@fethabo/animated-ui/matrix-rain'
import type { DemoControl } from '../content'

export default function MatrixRainDemo(props: Record<string, unknown>) {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <MatrixRain color="#22c55e" headColor="#d9ffe3" fontSize={16} {...props} />
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'fontSize', type: 'number', min: 10, max: 32, step: 1, default: 16 },
  { prop: 'speed', type: 'number', min: 0.2, max: 4, step: 0.2, default: 1 },
  { prop: 'color', type: 'color', default: '#22c55e' },
  { prop: 'headColor', type: 'color', default: '#d9ffe3' },
  { prop: 'background', type: 'color', default: '#040905' },
  { prop: 'fixed', type: 'boolean', default: false },
]
