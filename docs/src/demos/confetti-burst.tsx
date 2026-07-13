import { useRef } from 'react'
import { ConfettiBurst, type ConfettiBurstHandle } from '@fethabo/animated-ui/confetti-burst'

/** One-shot: se dispara con el botón, nunca en mount. */
export default function ConfettiBurstDemo() {
  const ref = useRef<ConfettiBurstHandle>(null)

  return (
    <div className="docs-demo-stage" style={{ position: 'relative' }}>
      <ConfettiBurst ref={ref} count={120} spread={75} />
      <button
        type="button"
        onClick={() => ref.current?.fire()}
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
        fire() 🎉
      </button>
    </div>
  )
}
