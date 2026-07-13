import { CursorTrail } from '@fethabo/animated-ui'

export default {
  id: 'cursor-trail',
  title: 'CursorTrail — estela de partículas o línea que sigue al puntero',
  height: '60vh',
  controls: [
    { prop: 'mode', type: 'enum', options: ['particles', 'line'], default: 'particles' },
    { prop: 'color', type: 'color', default: '#7c3aed' },
    { prop: 'size', type: 'number', min: 2, max: 24, step: 1, default: 8 },
    { prop: 'life', type: 'number', min: 0.2, max: 2, step: 0.1, default: 0.6 },
    { prop: 'length', type: 'number', min: 8, max: 120, step: 4, default: 36 },
    { prop: 'emitEvery', type: 'number', min: 2, max: 60, step: 2, default: 12 },
  ],
  render: (props) => (
    <CursorTrail
      {...props}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: '#0f0f1a',
      }}
    >
      {/* Children interactivos: el overlay no intercepta el click. */}
      <button
        onClick={() => console.log('el click atraviesa el overlay')}
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
        Movete alrededor — el botón sigue clickeable
      </button>
    </CursorTrail>
  ),
}
