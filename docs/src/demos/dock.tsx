import { Dock } from '@fethabo/animated-ui/dock'
import type { DemoControl } from '../content'

const ICONS = ['🏠', '🔍', '💬', '🎵', '📷', '🗂️', '⚙️']

export default function DockDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <Dock
        magnification={1.6}
        radius={130}
        {...props}
        style={{
          padding: '10px 14px',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid #2c2c4a',
        }}
      >
        {ICONS.map((icon) => (
          <Dock.Item key={icon}>
            <button
              style={{
                width: 52,
                height: 52,
                fontSize: 26,
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.12)',
              }}
            >
              {icon}
            </button>
          </Dock.Item>
        ))}
      </Dock>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'orientation', type: 'enum', options: ['horizontal', 'vertical'], default: 'horizontal' },
  { prop: 'magnification', type: 'number', min: 1, max: 3, step: 0.1, default: 1.6 },
  { prop: 'radius', type: 'number', min: 40, max: 300, step: 10, default: 130 },
  { prop: 'gap', type: 'number', min: 0, max: 32, step: 2, default: 8 },
  { prop: 'returnDuration', type: 'number', min: 0.05, max: 1, step: 0.05, default: 0.25 },
]
