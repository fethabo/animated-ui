import { useRef } from 'react'
import { EmojiBurst, type EmojiBurstHandle } from '@fethabo/animated-ui/emoji-burst'
import type { DemoControl } from '../content'

export default function EmojiBurstDemo(props: Record<string, unknown>) {
  const ref = useRef<EmojiBurstHandle>(null)
  return (
    <div className="docs-demo-stage" style={{ position: 'relative' }}>
      <EmojiBurst ref={ref} emojis={['🎉', '✨', '❤️', '⭐', '🎊']} count={36} {...props} />
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
  { prop: 'count', type: 'number', min: 10, max: 100, step: 5, default: 36 },
  { prop: 'size', type: 'number', min: 12, max: 48, step: 2, default: 24 },
  { prop: 'spread', type: 'number', min: 20, max: 160, step: 10, default: 70 },
  { prop: 'power', type: 'number', min: 4, max: 20, step: 1, default: 11 },
  { prop: 'angle', type: 'number', min: 0, max: 360, step: 5, default: 90 },
  { prop: 'gravity', type: 'number', min: 0.05, max: 1, step: 0.05, default: 0.25 },
]
