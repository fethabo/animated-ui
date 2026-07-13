import { useRef } from 'react'
import { EmojiBurst, type EmojiBurstHandle } from '@fethabo/animated-ui/emoji-burst'

export default function EmojiBurstDemo() {
  const ref = useRef<EmojiBurstHandle>(null)
  return (
    <div className="docs-demo-stage" style={{ position: 'relative' }}>
      <EmojiBurst ref={ref} emojis={['🎉', '✨', '❤️', '⭐', '🎊']} count={36} />
      <button type="button" onClick={() => ref.current?.fire()} style={{ font: 'inherit', fontWeight: 600, padding: '10px 26px', borderRadius: 10, border: 'none', background: '#7c3aed', color: '#fff', cursor: 'pointer' }}>
        fire() 🎉
      </button>
    </div>
  )
}
