import { useRef } from 'react'
import { FireworksBurst, type FireworksBurstHandle } from '@fethabo/animated-ui/fireworks-burst'

export function Example() {
  const ref = useRef<FireworksBurstHandle>(null)

  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <FireworksBurst ref={ref} particleCount={80} />
      <button onClick={() => ref.current?.fire({ rockets: 3 })}>Celebrate 🎆</button>
    </div>
  )
}
