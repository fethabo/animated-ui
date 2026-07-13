import { RippleContainer } from '@fethabo/animated-ui'

export default {
  id: 'ripple-container',
  title: 'RippleContainer — ondas desde el punto de click',
  height: '50vh',
  controls: [
    { prop: 'color', type: 'color', default: '#ffffff' },
    { prop: 'duration', type: 'number', min: 200, max: 2000, step: 100, default: 600 },
    { prop: 'maxRadius', type: 'number', min: 0, max: 400, step: 20, default: 0 },
    { prop: 'opacity', type: 'number', min: 0.05, max: 1, step: 0.05, default: 0.25 },
  ],
  // maxRadius 0 en el panel = default del componente (cubrir el contenedor).
  render: ({ maxRadius, ...props }) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <RippleContainer
        {...props}
        maxRadius={maxRadius > 0 ? maxRadius : undefined}
        style={{
          width: 340,
          height: 200,
          borderRadius: 20,
          background: '#7c3aed',
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <p style={{ margin: 0 }}>Clicks rápidos = ondas concurrentes</p>
      </RippleContainer>
      <RippleContainer
        {...props}
        maxRadius={maxRadius > 0 ? maxRadius : undefined}
        style={{ borderRadius: 12 }}
      >
        {/* Children interactivos: el click dispara la onda Y el onClick. */}
        <button
          onClick={() => console.log('onClick del botón sigue funcionando')}
          style={{
            padding: '1rem 2.5rem',
            borderRadius: 12,
            border: '1px solid #444',
            background: '#1e1b2e',
            color: '#e5e5e5',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Botón con onClick propio
        </button>
      </RippleContainer>
    </div>
  ),
}
