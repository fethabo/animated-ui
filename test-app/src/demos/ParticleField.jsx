import { ParticleField } from '@fethabo/animated-ui'

export default {
  id: 'particle-field',
  title: 'ParticleField — interacción con el cursor (mové el mouse)',
  height: '80vh',
  controls: [
    { prop: 'count', type: 'number', min: 10, max: 300, step: 10, default: 90 },
    { prop: 'color', type: 'color', default: '#22d3ee' },
    { prop: 'cursorInteraction', type: 'enum', options: ['repel', 'attract', 'none'], default: 'repel' },
    { prop: 'speed', type: 'number', min: 0.1, max: 3, step: 0.1, default: 0.4 },
    { prop: 'radius', type: 'number', min: 1, max: 8, step: 1, default: 2 },
    { prop: 'cursorRadius', type: 'number', min: 40, max: 300, step: 10, default: 120 },
  ],
  // El canvas llena el contenedor (la Section es position:relative).
  render: (props) => (
    <div style={{ position: 'absolute', inset: 0 }}>
      <ParticleField {...props} />
    </div>
  ),
}
