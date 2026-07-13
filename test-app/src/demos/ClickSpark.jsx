import { ClickSpark } from '@fethabo/animated-ui'

const PALETTE = ['#fbbf24', '#f59e0b', '#fde68a']

// Declarativo: sin ref — cada click dentro del área emite chispas en el punto
// del evento. El botón verifica que los children siguen siendo interactivos.
function Demo(props) {
  return (
    <ClickSpark
      {...props}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        color: '#a1a1aa',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 16 }}>Clickeá en cualquier punto del área</p>
        <button
          onClick={() => console.log('[ClickSpark] children interactivos ✔')}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1.1rem',
            borderRadius: 12,
            border: 'none',
            background: '#7c3aed',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Botón interactivo (mirá la consola)
        </button>
      </div>
    </ClickSpark>
  )
}

export default {
  id: 'click-spark',
  title: 'ClickSpark — chispas automáticas por click, declarativo (children interactivos)',
  height: '60vh',
  controls: [
    { prop: 'colors', type: 'multi', options: PALETTE, asColors: true, default: PALETTE },
    { prop: 'count', type: 'number', min: 3, max: 24, step: 1, default: 8 },
    { prop: 'size', type: 'number', min: 3, max: 20, step: 1, default: 8 },
    { prop: 'radius', type: 'number', min: 10, max: 120, step: 5, default: 40 },
    { prop: 'duration', type: 'number', min: 0.2, max: 1.5, step: 0.1, default: 0.4 },
  ],
  render: (props) => <Demo {...props} />,
}
