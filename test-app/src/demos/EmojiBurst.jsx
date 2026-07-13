import { useRef } from 'react'
import { EmojiBurst } from '@fethabo/animated-ui'

const EMOJI_OPTIONS = ['🎉', '✨', '❤️', '👍', '🥳', '⭐']

// El handle es imperativo: el panel controla los defaults; los botones
// demuestran el disparo con defaults y con override de emojis por ráfaga.
function Demo({ originX, originY, ...props }) {
  const ref = useRef(null)
  const buttonStyle = {
    padding: '0.75rem 1.25rem',
    fontSize: '1rem',
    borderRadius: 12,
    border: 'none',
    background: '#7c3aed',
    color: '#fff',
    cursor: 'pointer',
  }
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <EmojiBurst {...props} origin={{ x: originX, y: originY }} ref={ref} />
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
        <button onClick={() => ref.current?.fire()} style={buttonStyle}>
          fire()
        </button>
        <button onClick={() => ref.current?.fire({ emojis: ['❤️'] })} style={buttonStyle}>
          ❤️
        </button>
        <button onClick={() => ref.current?.fire({ emojis: ['🥳', '🎉'] })} style={buttonStyle}>
          🥳
        </button>
      </div>
    </div>
  )
}

export default {
  id: 'emoji-burst',
  title: 'EmojiBurst — ráfaga de emojis con física de confetti (fillText, cero assets)',
  height: '80vh',
  controls: [
    { prop: 'emojis', type: 'multi', options: EMOJI_OPTIONS, default: ['🎉', '✨', '❤️'] },
    { prop: 'count', type: 'number', min: 5, max: 80, step: 5, default: 30 },
    { prop: 'size', type: 'number', min: 12, max: 48, step: 2, default: 24 },
    { prop: 'originX', type: 'number', min: 0, max: 1, step: 0.05, default: 0.5 },
    { prop: 'originY', type: 'number', min: 0, max: 1, step: 0.05, default: 0.5 },
    { prop: 'angle', type: 'number', min: 0, max: 360, step: 5, default: 90 },
    { prop: 'spread', type: 'number', min: 5, max: 360, step: 5, default: 70 },
    { prop: 'power', type: 'number', min: 2, max: 30, step: 1, default: 11 },
    { prop: 'gravity', type: 'number', min: 0, max: 1, step: 0.05, default: 0.25 },
  ],
  render: (props) => <Demo {...props} />,
}
