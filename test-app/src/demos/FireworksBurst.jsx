import { useRef } from 'react'
import { FireworksBurst } from '@fethabo/animated-ui'

const PALETTE = ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa']

// El handle es imperativo: el demo necesita un componente propio para tener
// el useRef y el botón de disparo; el panel controla los defaults (props).
function Demo({ originX, originY, ...props }) {
  const ref = useRef(null)
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <FireworksBurst {...props} origin={{ x: originX, y: originY }} ref={ref} />
      <button
        onClick={() => ref.current?.fire()}
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '10%',
          transform: 'translateX(-50%)',
          padding: '0.75rem 2rem',
          fontSize: '1.1rem',
          borderRadius: 12,
          border: 'none',
          background: '#7c3aed',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        🎆 fire()
      </button>
    </div>
  )
}

export default {
  id: 'fireworks-burst',
  title: 'FireworksBurst — cohetes que ascienden y explotan en el apex (disparos sucesivos se acumulan)',
  height: '80vh',
  controls: [
    { prop: 'rockets', type: 'number', min: 1, max: 8, step: 1, default: 1 },
    { prop: 'particleCount', type: 'number', min: 10, max: 200, step: 10, default: 60 },
    { prop: 'colors', type: 'multi', options: PALETTE, asColors: true, default: PALETTE },
    { prop: 'originX', type: 'number', min: 0, max: 1, step: 0.05, default: 0.5 },
    { prop: 'originY', type: 'number', min: 0, max: 1, step: 0.05, default: 1 },
    { prop: 'power', type: 'number', min: 6, max: 24, step: 1, default: 13 },
    { prop: 'gravity', type: 'number', min: 0.05, max: 0.6, step: 0.01, default: 0.18 },
  ],
  render: (props) => <Demo {...props} />,
}
