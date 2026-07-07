import { useRef } from 'react'
import { ConfettiBurst } from '@fethabo/animated-ui'

const PALETTE = ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa']

// El handle es imperativo: el demo necesita un componente propio para tener
// el useRef y el botón de disparo; el panel controla los defaults (props).
function Demo({ originX, originY, ...props }) {
  const ref = useRef(null)
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <ConfettiBurst {...props} origin={{ x: originX, y: originY }} ref={ref} />
      <button
        onClick={() => ref.current?.fire()}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '0.75rem 2rem',
          fontSize: '1.1rem',
          borderRadius: 12,
          border: 'none',
          background: '#7c3aed',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        🎉 fire()
      </button>
    </div>
  )
}

export default {
  id: 'confetti-burst',
  title: 'ConfettiBurst — one-shot imperativo (apretá el botón; disparos sucesivos se acumulan)',
  height: '80vh',
  controls: [
    { prop: 'count', type: 'number', min: 10, max: 300, step: 10, default: 80 },
    { prop: 'colors', type: 'multi', options: PALETTE, asColors: true, default: PALETTE },
    { prop: 'shapes', type: 'multi', options: ['rect', 'circle'], default: ['rect', 'circle'] },
    { prop: 'originX', type: 'number', min: 0, max: 1, step: 0.05, default: 0.5 },
    { prop: 'originY', type: 'number', min: 0, max: 1, step: 0.05, default: 0.5 },
    { prop: 'angle', type: 'number', min: 0, max: 360, step: 5, default: 90 },
    { prop: 'spread', type: 'number', min: 5, max: 360, step: 5, default: 60 },
    { prop: 'power', type: 'number', min: 2, max: 30, step: 1, default: 12 },
    { prop: 'gravity', type: 'number', min: 0, max: 1, step: 0.05, default: 0.25 },
  ],
  render: (props) => <Demo {...props} />,
}
