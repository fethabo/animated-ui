import { useRef } from 'react'
import { SparkleBurst, type SparkleBurstHandle } from '@fethabo/animated-ui/sparkle-burst'
import type { DemoControl } from '../content'

export default function SparkleBurstDemo(props: Record<string, unknown>) {
  const ref = useRef<SparkleBurstHandle>(null)
  return (
    <div className="docs-demo-stage" style={{ position: 'relative' }}>
      <SparkleBurst ref={ref} count={12} spread={80} {...props} />
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
        fire() ✨
      </button>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'count', type: 'number', min: 4, max: 40, step: 2, default: 12 },
  { prop: 'spread', type: 'number', min: 20, max: 160, step: 10, default: 80 },
  { prop: 'size', type: 'number', min: 4, max: 28, step: 2, default: 12 },
  { prop: 'duration', type: 'number', min: 0.3, max: 2, step: 0.1, default: 0.9 },
  {
    prop: 'colors',
    type: 'multi',
    asColors: true,
    options: ['#fde68a', '#fbbf24', '#ffffff', '#f59e0b', '#7c3aed', '#0ea5e9', '#ec4899'],
    default: ['#fde68a', '#fbbf24', '#ffffff'],
  },
]
