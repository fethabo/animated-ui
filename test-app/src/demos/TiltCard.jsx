import { TiltCard } from '@fethabo/animated-ui'

const card = {
  width: 320,
  padding: '3rem 2rem',
  borderRadius: 16,
  background: '#12121f',
  border: '1px solid #333',
  textAlign: 'center',
}

export default {
  id: 'tilt-card',
  title: 'TiltCard — glare + render prop',
  height: '50vh',
  controls: [
    { prop: 'glare', type: 'boolean', default: true },
    { prop: 'maxAngle', type: 'number', min: 0, max: 30, step: 1, default: 12 },
    { prop: 'perspective', type: 'number', min: 300, max: 2000, step: 50, default: 1000 },
  ],
  // El contenido del render prop queda fijo; las props escalares se controlan.
  render: (props) => (
    <TiltCard {...props} style={{ position: 'relative' }}>
      {({ tiltX, tiltY, isHovering }) => (
        <div style={card}>
          <strong>TiltCard</strong>
          <p style={{ opacity: 0.7 }}>
            tiltX: {tiltX.toFixed(1)}° · tiltY: {tiltY.toFixed(1)}° · {isHovering ? 'hover' : 'idle'}
          </p>
        </div>
      )}
    </TiltCard>
  ),
}
