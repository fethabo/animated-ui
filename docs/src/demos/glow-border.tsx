import { GlowBorder } from '@fethabo/animated-ui/glow-border'
import type { DemoControl } from '../content'

export default function GlowBorderDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <GlowBorder
        width={2}
        radius={16}
        colors={['#7c3aed', '#0ea5e9']}
        {...props}
        contentStyle={{
          background: '#12121f',
          padding: '32px 28px',
          maxWidth: 300,
        }}
      >
        <h3 style={{ margin: '0 0 8px' }}>GlowBorder</h3>
        <p style={{ margin: 0, opacity: 0.7 }}>A conic gradient rotates around the perimeter.</p>
      </GlowBorder>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'width', type: 'number', min: 1, max: 8, step: 1, default: 2 },
  { prop: 'radius', type: 'number', min: 0, max: 40, step: 2, default: 16 },
  { prop: 'speed', type: 'number', min: 1, max: 12, step: 0.5, default: 6 },
  { prop: 'opacity', type: 'number', min: 0, max: 1, step: 0.05, default: 1 },
  { prop: 'followCursor', type: 'boolean', default: false },
  {
    prop: 'colors',
    type: 'multi',
    asColors: true,
    options: ['#7c3aed', '#0ea5e9', '#10b981', '#ec4899', '#f59e0b', '#22d3ee', '#a78bfa'],
    default: ['#7c3aed', '#0ea5e9'],
  },
]
