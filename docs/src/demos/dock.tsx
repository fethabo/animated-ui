import { Dock } from '@fethabo/animated-ui/dock'

const ICONS = ['🏠', '🔍', '💬', '🎵', '📷', '🗂️', '⚙️']

export default function DockDemo() {
  return (
    <div className="docs-demo-stage">
      <Dock magnification={1.6} radius={130} style={{ padding: '10px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid #2c2c4a' }}>
        {ICONS.map((icon) => (
          <Dock.Item key={icon}>
            <button style={{ width: 52, height: 52, fontSize: 26, borderRadius: 14, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.12)' }}>
              {icon}
            </button>
          </Dock.Item>
        ))}
      </Dock>
    </div>
  )
}
