import { MagneticElement } from '@fethabo/animated-ui'

export default {
  id: 'magnetic-element',
  title: 'MagneticElement — atracción al cursor',
  height: '50vh',
  controls: [
    { prop: 'strength', type: 'number', min: 0, max: 1, step: 0.05, default: 0.35 },
    { prop: 'hitArea', type: 'number', min: 0, max: 120, step: 5, default: 40 },
  ],
  // El contenido del render prop queda fijo; las props escalares se controlan.
  render: (props) => (
    <MagneticElement {...props}>
      {({ offsetX, offsetY, isActive }) => (
        <div
          style={{
            padding: '1.5rem 2rem',
            borderRadius: 12,
            background: '#12121f',
            border: `1px solid ${isActive ? '#7c3aed' : '#333'}`,
            textAlign: 'center',
          }}
        >
          <strong>Atrapame</strong>
          <p style={{ opacity: 0.7, margin: 0 }}>
            x: {offsetX.toFixed(0)} · y: {offsetY.toFixed(0)} · {isActive ? 'activo' : 'reposo'}
          </p>
        </div>
      )}
    </MagneticElement>
  ),
}
