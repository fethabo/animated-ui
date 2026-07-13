import { useRef } from 'react'
import { SparkleBurst, type SparkleBurstHandle } from '@fethabo/animated-ui/sparkle-burst'

export default function SparkleBurstDemo() {
  const ref = useRef<SparkleBurstHandle>(null)
  return (
    <div className="docs-demo-stage" style={{ position: 'relative' }}>
      <SparkleBurst ref={ref} count={12} spread={80} />
      <button type="button" onClick={() => ref.current?.fire()} style={{ font: 'inherit', fontWeight: 600, padding: '10px 26px', borderRadius: 10, border: 'none', background: '#7c3aed', color: '#fff', cursor: 'pointer' }}>
        fire() ✨
      </button>
    </div>
  )
}
