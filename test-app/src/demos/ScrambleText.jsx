import { ScrambleText } from '@fethabo/animated-ui'

export default {
  id: 'scramble-text',
  title: 'ScrambleText — mount / hover',
  height: '50vh',
  controls: [
    { prop: 'text', type: 'text', default: 'Pasá el mouse para re-descifrar' },
    { prop: 'trigger', type: 'enum', options: ['mount', 'hover', 'both'], default: 'both' },
    { prop: 'scrambleColor', type: 'color', default: '#f472b6' },
    { prop: 'speed', type: 'number', min: 5, max: 80, step: 5, default: 25 },
  ],
  render: (props) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', position: 'relative' }}>
      {/* Caso fijo: reveal al montar, verde (el clásico "Acceso concedido"). */}
      <h1 style={{ fontFamily: 'monospace', fontSize: '2rem', margin: 0, color: '#4ade80' }}>
        <ScrambleText text="Acceso concedido: bienvenido" />
      </h1>
      {/* Caso controlado por el panel (trigger / scrambleColor / speed / text). */}
      <p style={{ fontFamily: 'monospace', fontSize: '1.5rem', margin: 0 }}>
        <ScrambleText {...props} />
      </p>
    </div>
  ),
}
