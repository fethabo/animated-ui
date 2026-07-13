import { ScribbleDecoration } from '@fethabo/animated-ui'

// Shape custom por función: cumple el contrato (size, seed, options) => d.
// Zigzag simple para verificar la extensibilidad sin tocar el paquete.
const zigzag = ({ width, height }) => {
  const steps = 6
  let d = `M 0 ${height * 0.8}`
  for (let i = 1; i <= steps; i++) {
    d += ` L ${(width / steps) * i} ${i % 2 === 0 ? height * 0.8 : height * 0.2}`
  }
  return d
}

export default {
  id: 'scribble-decoration',
  title: 'ScribbleDecoration — garabatos procedurales (el zigzag violeta es una shape custom por función)',
  height: '60vh',
  controls: [
    {
      prop: 'shape',
      type: 'enum',
      options: ['arrow', 'asterisk', 'spiral', 'underline', 'circle'],
      default: 'arrow',
    },
    { prop: 'trigger', type: 'enum', options: ['in-view', 'mount'], default: 'in-view' },
    { prop: 'once', type: 'boolean', default: false },
    { prop: 'repeat', type: 'boolean', default: false },
    { prop: 'color', type: 'color', default: '#f43f5e' },
    { prop: 'strokeWidth', type: 'number', min: 1, max: 10, step: 0.5, default: 3 },
    { prop: 'duration', type: 'number', min: 0.2, max: 3, step: 0.1, default: 0.9 },
    { prop: 'delay', type: 'number', min: 0, max: 2, step: 0.1, default: 0 },
    { prop: 'seed', type: 'text', default: 'aui' },
  ],
  render: (props) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 48,
        height: '100%',
        justifyContent: 'center',
        fontFamily: 'system-ui',
        color: '#e5e5e5',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <ScribbleDecoration {...props} style={{ width: 200, height: 120 }} />
        <p>shape builtin</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ScribbleDecoration
          {...props}
          shape={zigzag}
          color="#a78bfa"
          style={{ width: 200, height: 120 }}
        />
        <p>shape custom (función)</p>
      </div>
    </div>
  ),
}
