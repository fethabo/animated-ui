import { WavyText } from '@fethabo/animated-ui/wavy-text'
import type { DemoControl } from '../content'

export default function WavyTextDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2.6rem', fontWeight: 700, color: '#a78bfa' }}>
        <WavyText amplitude={8} speed={1.6} {...props}>
          floating letters
        </WavyText>
      </div>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'amplitude', type: 'number', min: 0, max: 24, step: 1, default: 8 },
  { prop: 'speed', type: 'number', min: 0.4, max: 4, step: 0.2, default: 1.6 },
  { prop: 'stagger', type: 'number', min: 0, max: 0.3, step: 0.02, default: 0.06 },
]
