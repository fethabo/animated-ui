import { GlitchText } from '@fethabo/animated-ui/glitch-text'
import type { DemoControl } from '../content'

export default function GlitchTextDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2.6rem', fontWeight: 800, letterSpacing: '0.04em' }}>
        <GlitchText trigger="loop" intensity={3} frequency={2} {...props}>
          SYSTEM FAILURE
        </GlitchText>
      </div>
      <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>
        <GlitchText trigger="hover" intensity={4}>
          hover me
        </GlitchText>
      </p>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'intensity', type: 'number', min: 0, max: 10, step: 1, default: 3 },
  { prop: 'frequency', type: 'number', min: 0, max: 6, step: 1, default: 2 },
  { prop: 'burstDuration', type: 'number', min: 0.1, max: 1, step: 0.05, default: 0.3 },
  { prop: 'trigger', type: 'enum', options: ['loop', 'hover'], default: 'loop' },
  {
    prop: 'colors',
    type: 'multi',
    asColors: true,
    options: ['#ff0040', '#00ffff', '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b'],
    default: ['#ff0040', '#00ffff'],
  },
]
