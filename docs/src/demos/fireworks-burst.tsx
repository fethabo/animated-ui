import { useRef } from 'react'
import { FireworksBurst, type FireworksBurstHandle } from '@fethabo/animated-ui/fireworks-burst'
import type { DemoControl } from '../content'

/** One-shot: se dispara con el botón, nunca en mount. Los controles ajustan los
 *  defaults del próximo fire(). */
export default function FireworksBurstDemo(props: Record<string, unknown>) {
  const ref = useRef<FireworksBurstHandle>(null)

  return (
    <div className="docs-demo-stage" style={{ position: 'relative' }}>
      <FireworksBurst
        ref={ref}
        particleCount={90}
        colors={['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa']}
        {...props}
      />
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
        fire() 🎆
      </button>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'particleCount', type: 'number', min: 20, max: 200, step: 10, default: 90 },
  { prop: 'power', type: 'number', min: 2, max: 16, step: 1, default: 6 },
  { prop: 'gravity', type: 'number', min: 0.02, max: 0.5, step: 0.02, default: 0.12 },
  { prop: 'rockets', type: 'number', min: 1, max: 8, step: 1, default: 3 },
  {
    prop: 'colors',
    type: 'multi',
    asColors: true,
    options: ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa', '#7c3aed', '#0ea5e9', '#ec4899'],
    default: ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa'],
  },
]
