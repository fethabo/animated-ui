import { AnimatedBackground } from '@fethabo/animated-ui/animated-background'
import type { DemoControl } from '../content'

export default function AnimatedBackgroundDemo(props: Record<string, unknown>) {
  const variant = (props.variant as string) ?? 'aurora'
  return (
    <div style={{ position: 'relative', minHeight: 320, overflow: 'hidden', borderRadius: 12 }}>
      <AnimatedBackground
        colors={['#7c3aed', '#0ea5e9', '#10b981', '#ec4899']}
        speed={12}
        {...props}
      />
      <div
        style={{
          position: 'relative',
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 8,
          color: '#f4f4ff',
        }}
      >
        <h3 style={{ margin: 0, fontSize: 28, textTransform: 'capitalize' }}>{variant}</h3>
        <p style={{ margin: 0, opacity: 0.75 }}>probá las variantes en los controles →</p>
      </div>
    </div>
  )
}

export const controls: DemoControl[] = [
  {
    prop: 'variant',
    type: 'enum',
    options: ['aurora', 'mesh', 'beam', 'noise', 'lava', 'grid', 'rays', 'dots'],
    default: 'aurora',
  },
  { prop: 'speed', type: 'number', min: 0, max: 40, step: 1, default: 12 },
  { prop: 'intensity', type: 'number', min: 0, max: 2, step: 0.1, default: 1 },
  { prop: 'fixed', type: 'boolean', default: false },
  {
    prop: 'colors',
    type: 'multi',
    asColors: true,
    options: ['#7c3aed', '#0ea5e9', '#10b981', '#ec4899', '#f59e0b', '#ef4444', '#22d3ee', '#a78bfa'],
    default: ['#7c3aed', '#0ea5e9', '#10b981', '#ec4899'],
  },
]
