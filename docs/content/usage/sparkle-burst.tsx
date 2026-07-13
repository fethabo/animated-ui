import { useRef } from 'react'
import { SparkleBurst, type SparkleBurstHandle } from '@fethabo/animated-ui/sparkle-burst'

export function Example() {
  const ref = useRef<SparkleBurstHandle>(null)
  return (
    <div style={{ position: 'relative', minHeight: 240 }}>
      <SparkleBurst ref={ref} count={10} />
      <button onClick={() => ref.current?.fire()}>Sparkle ✨</button>
    </div>
  )
}
