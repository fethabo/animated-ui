import { ScrollReveal } from '@fethabo/animated-ui'

export default {
  id: 'scroll-reveal',
  title: 'ScrollReveal — stagger al entrar al viewport (scrolleá hasta acá)',
  height: '80vh',
  controls: [
    { prop: 'direction', type: 'enum', options: ['up', 'down', 'left', 'right', 'none'], default: 'up' },
    { prop: 'stagger', type: 'number', min: 0, max: 1, step: 0.05, default: 0.2 },
    { prop: 'distance', type: 'number', min: 0, max: 120, step: 4, default: 32 },
    { prop: 'duration', type: 'number', min: 0.1, max: 3, step: 0.1, default: 0.6 },
    { prop: 'threshold', type: 'number', min: 0, max: 1, step: 0.05, default: 0.15 },
    { prop: 'once', type: 'boolean', default: true },
  ],
  render: (props) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', position: 'relative' }}>
      {/* Caso controlado por el panel (direction / stagger / distance / ...). */}
      <ScrollReveal {...props} style={{ display: 'flex', gap: '2rem' }}>
        {['Uno', 'Dos', 'Tres'].map((label) => (
          <div
            key={label}
            style={{
              width: 200,
              padding: '2.5rem 1.5rem',
              borderRadius: 16,
              background: '#12121f',
              border: '1px solid #333',
              textAlign: 'center',
            }}
          >
            <strong>{label}</strong>
            <p style={{ opacity: 0.7, margin: 0 }}>Entra en cascada.</p>
          </div>
        ))}
      </ScrollReveal>
      {/* Caso fijo: override por CASCADA. La var en el padre pisa la duración
          sin pasar props, y este reveal entra lento desde la derecha. */}
      <div style={{ '--aui-reveal-duration': '1.5s' }}>
        <ScrollReveal direction="left">
          <p style={{ opacity: 0.7, margin: 0 }}>
            Este entra desde la derecha, lento via --aui-reveal-duration en cascada.
          </p>
        </ScrollReveal>
      </div>
    </div>
  ),
}
