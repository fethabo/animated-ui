import { useRef } from 'react'
import { ConfettiBurst, type ConfettiBurstHandle } from '@fethabo/animated-ui/confetti-burst'
import type { DemoControl } from '../content'

/** One-shot: se dispara con el botón, nunca en mount. Los controles ajustan los
 *  defaults del próximo fire(). */
export default function ConfettiBurstDemo(props: Record<string, unknown>) {
  const ref = useRef<ConfettiBurstHandle>(null)

  return (
    <div className="docs-demo-stage" style={{ position: 'relative' }}>
      <ConfettiBurst ref={ref} count={120} spread={75} {...props} />
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

export const controls: DemoControl[] = [
  { prop: 'count', type: 'number', min: 20, max: 300, step: 10, default: 120 },
  { prop: 'spread', type: 'number', min: 10, max: 180, step: 5, default: 75 },
  { prop: 'power', type: 'number', min: 4, max: 24, step: 1, default: 12 },
  { prop: 'gravity', type: 'number', min: 0.05, max: 1, step: 0.05, default: 0.25 },
  { prop: 'angle', type: 'number', min: 0, max: 360, step: 5, default: 90 },
  {
    prop: 'shapes',
    type: 'multi',
    options: ['rect', 'circle'],
    default: ['rect', 'circle'],
  },
  {
    prop: 'colors',
    type: 'multi',
    asColors: true,
    options: ['#7c3aed', '#0ea5e9', '#10b981', '#ec4899', '#f59e0b', '#ef4444', '#22d3ee', '#a78bfa'],
    default: ['#7c3aed', '#0ea5e9', '#10b981', '#ec4899', '#f59e0b'],
  },
]
