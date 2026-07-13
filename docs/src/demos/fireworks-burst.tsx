import { useRef } from 'react'
import { FireworksBurst, type FireworksBurstHandle } from '@fethabo/animated-ui/fireworks-burst'

/** One-shot: se dispara con el botón, nunca en mount. */
export default function FireworksBurstDemo() {
  const ref = useRef<FireworksBurstHandle>(null)

  return (
    <div className="docs-demo-stage" style={{ position: 'relative' }}>
      <FireworksBurst
        ref={ref}
        particleCount={90}
        colors={['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa']}
      />
      <button
        type="button"
        onClick={() => ref.current?.fire({ rockets: 3 })}
        style={{
          font: 'inherit',
          fontWeight: 600,
          padding: '10px 26px',
          borderRadius: 10,
          border: 'none',
          background: '#7c3aed',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        fire() 🎆
      </button>
    </div>
  )
}
