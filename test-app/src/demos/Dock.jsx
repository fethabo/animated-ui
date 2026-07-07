import { Dock } from '@fethabo/animated-ui'

const ICONS = ['🏠', '🔍', '💬', '🎵', '📷', '🗂️', '⚙️']

const itemStyle = {
  width: 52,
  height: 52,
  fontSize: 26,
  borderRadius: 14,
  border: 'none',
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.14)',
}

export default {
  id: 'dock',
  title: 'Dock — magnificación por proximidad (pasá el mouse; los botones siguen clickeables)',
  height: '50vh',
  controls: [
    { prop: 'magnification', type: 'number', min: 1, max: 3, step: 0.1, default: 1.5 },
    { prop: 'radius', type: 'number', min: 40, max: 300, step: 10, default: 120 },
    { prop: 'gap', type: 'number', min: 0, max: 32, step: 2, default: 8 },
    { prop: 'orientation', type: 'enum', options: ['horizontal', 'vertical'], default: 'horizontal' },
    { prop: 'returnDuration', type: 'number', min: 0.05, max: 1, step: 0.05, default: 0.25 },
  ],
  render: (props) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: props.orientation === 'vertical' ? 'center start' : 'end center',
        padding: 24,
      }}
    >
      <Dock
        {...props}
        style={{
          padding: '10px 14px',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {ICONS.map((icon) => (
          <Dock.Item key={icon}>
            <button style={itemStyle} onClick={() => console.log('click', icon)}>
              {icon}
            </button>
          </Dock.Item>
        ))}
      </Dock>
    </div>
  ),
}
