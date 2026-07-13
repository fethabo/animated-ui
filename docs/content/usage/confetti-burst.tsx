import { useRef } from 'react'
import { ConfettiBurst, type ConfettiBurstHandle } from '@fethabo/animated-ui/confetti-burst'

export function Example() {
  const confettiRef = useRef<ConfettiBurstHandle>(null)

  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <ConfettiBurst ref={confettiRef} count={120} spread={75} />
      <button onClick={() => confettiRef.current?.fire()}>Celebrate 🎉</button>
    </div>
  )
}
