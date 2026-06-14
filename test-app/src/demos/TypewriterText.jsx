import { TypewriterText } from '@fethabo/animated-ui'

export default {
  id: 'typewriter-text',
  title: 'TypewriterText — single / loop multi-string',
  height: '55vh',
  controls: [
    { prop: 'text', type: 'text', default: 'Escribiendo carácter por carácter…' },
    { prop: 'speed', type: 'number', min: 5, max: 80, step: 5, default: 30 },
    { prop: 'startDelay', type: 'number', min: 0, max: 2000, step: 100, default: 0 },
    { prop: 'cursor', type: 'boolean', default: true },
  ],
  render: (props) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', position: 'relative', fontFamily: 'monospace' }}>
      {/* Caso controlado por el panel (text / speed / startDelay / cursor). */}
      <h1 style={{ fontSize: '2rem', margin: 0, color: '#4ade80' }}>
        <TypewriterText {...props} />
      </h1>
      {/* Caso fijo: modo loop multi-string con cursor custom. */}
      <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#f472b6' }}>
        Hago <TypewriterText text={['Diseño', 'Código', 'Arte']} loop cursor="▋" />
      </h2>
    </div>
  ),
}
