import { WavyText } from '@fethabo/animated-ui'

export default {
  id: 'wavy-text',
  title: 'WavyText — ola continua sin romper la línea',
  height: '40vh',
  controls: [
    { prop: 'amplitude', type: 'number', min: 1, max: 24, step: 1, default: 6 },
    { prop: 'speed', type: 'number', min: 0.4, max: 5, step: 0.2, default: 1.6 },
    { prop: 'stagger', type: 'number', min: 0.01, max: 0.3, step: 0.01, default: 0.06 },
  ],
  render: (props) => (
    <p style={{ fontSize: '2rem', maxWidth: '80%' }}>
      Texto normal antes{' '}
      <WavyText {...props} style={{ color: '#38bdf8' }}>
        ¡olas en el texto!
      </WavyText>{' '}
      y texto normal después (la línea no se rompe).
    </p>
  ),
}
