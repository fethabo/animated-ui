import { useRef } from 'react'
import { EmojiBurst, type EmojiBurstHandle } from '@fethabo/animated-ui/emoji-burst'

export function Example() {
  const ref = useRef<EmojiBurstHandle>(null)
  return (
    <div style={{ position: 'relative', minHeight: 240 }}>
      <EmojiBurst ref={ref} emojis={['🎉', '✨', '❤️']} />
      <button onClick={() => ref.current?.fire()}>Burst 🎉</button>
    </div>
  )
}
