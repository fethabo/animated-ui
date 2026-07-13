import { useRef } from 'react'
import { AttentionCue } from '@fethabo/animated-ui/attention-cue'

export function Example() {
  const targetRef = useRef<HTMLButtonElement>(null)
  return (
    <AttentionCue target={targetRef} idleDelay={2000}>
      <div style={{ minHeight: 240 }}>
        <button ref={targetRef}>Click me</button>
      </div>
    </AttentionCue>
  )
}
