import { RotatingText } from '@fethabo/animated-ui/rotating-text'
import type { DemoControl } from '../content'

export default function RotatingTextDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2.2rem', fontWeight: 700 }}>
        We build{' '}
        <RotatingText
          words={['faster', 'lighter', 'smoother', 'zero-config']}
          color="#a78bfa"
          {...props}
        />
      </div>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'transition', type: 'enum', options: ['fade', 'slide-up', 'flip'], default: 'slide-up' },
  { prop: 'interval', type: 'number', min: 800, max: 4000, step: 100, default: 2200 },
  { prop: 'duration', type: 'number', min: 0.1, max: 1.2, step: 0.1, default: 0.4 },
  { prop: 'color', type: 'color', default: '#a78bfa' },
  { prop: 'loop', type: 'boolean', default: true },
]
