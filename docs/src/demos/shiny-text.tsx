import { ShinyText } from '@fethabo/animated-ui/shiny-text'
import type { DemoControl } from '../content'

export default function ShinyTextDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <h2 style={{ fontSize: '2.2rem', margin: 0 }}>
        <ShinyText color="#71717a" highlight="#fafafa" speed={3} {...props}>
          Shine on, you crazy text
        </ShinyText>
      </h2>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'color', type: 'color', default: '#71717a' },
  { prop: 'highlight', type: 'color', default: '#fafafa' },
  { prop: 'speed', type: 'number', min: 1, max: 8, step: 0.5, default: 3 },
  { prop: 'angle', type: 'number', min: 0, max: 360, step: 10, default: 120 },
]
