import { PixelBackground } from '@fethabo/animated-ui/pixel-background'
import type { DemoControl } from '../content'

export default function PixelBackgroundDemo(props: Record<string, unknown>) {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <PixelBackground behaviors={['hover', 'idle']} color="#7c3aed" cellSize={14} {...props} />
    </div>
  )
}

export const controls: DemoControl[] = [
  {
    prop: 'behaviors',
    type: 'multi',
    options: ['hover', 'idle', 'reveal'],
    default: ['hover', 'idle'],
  },
  { prop: 'color', type: 'color', default: '#7c3aed' },
  { prop: 'cellSize', type: 'number', min: 6, max: 32, step: 2, default: 14 },
  { prop: 'gap', type: 'number', min: 0, max: 10, step: 1, default: 2 },
  { prop: 'baseOpacity', type: 'number', min: 0, max: 1, step: 0.05, default: 0.15 },
  { prop: 'hoverRadius', type: 'number', min: 40, max: 300, step: 10, default: 120 },
  { prop: 'idleIntensity', type: 'number', min: 0, max: 1, step: 0.1, default: 1 },
  { prop: 'idleSpeed', type: 'number', min: 0.2, max: 4, step: 0.1, default: 1.5 },
  { prop: 'revealDuration', type: 'number', min: 200, max: 3000, step: 100, default: 1200 },
]
