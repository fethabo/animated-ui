import { useRef } from 'react'
import { SparkleBurst } from '@fethabo/animated-ui'

const PALETTE = ['#fde047', '#facc15', '#fef9c3', '#ffffff']

// El handle es imperativo: el botón dispara con los defaults del panel; el
// segundo botón demuestra el origin por disparo (destella donde está él).
function Demo({ originX, originY, ...props }) {
  const ref = useRef(null)
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <SparkleBurst {...props} origin={{ x: originX, y: originY }} ref={ref} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          gap: 12,
        }}
      >
        <button
          onClick={() => ref.current?.fire()}
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
          ✨ fire()
        </button>
        <button
          onClick={() => ref.current?.fire({ origin: { x: 0.85, y: 0.2 }, count: 5 })}
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.9rem',
            borderRadius: 12,
            border: '1px solid #7c3aed',
            background: 'transparent',
            color: '#a78bfa',
            cursor: 'pointer',
          }}
        >
          fire(esquina)
        </button>
      </div>
    </div>
  )
}

export default {
  id: 'sparkle-burst',
  title: 'SparkleBurst — destellos breves con aparición escalonada (like, favorito)',
  height: '60vh',
  controls: [
    { prop: 'count', type: 'number', min: 1, max: 40, step: 1, default: 8 },
    { prop: 'colors', type: 'multi', options: PALETTE, asColors: true, default: PALETTE },
    { prop: 'originX', type: 'number', min: 0, max: 1, step: 0.05, default: 0.5 },
    { prop: 'originY', type: 'number', min: 0, max: 1, step: 0.05, default: 0.5 },
    { prop: 'spread', type: 'number', min: 10, max: 200, step: 5, default: 60 },
    { prop: 'size', type: 'number', min: 4, max: 32, step: 1, default: 12 },
    { prop: 'duration', type: 'number', min: 0.3, max: 3, step: 0.1, default: 0.9 },
  ],
  render: (props) => <Demo {...props} />,
}
