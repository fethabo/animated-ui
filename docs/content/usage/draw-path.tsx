import { DrawPath } from '@fethabo/animated-ui/draw-path'

export function Example() {
  return (
    <DrawPath duration={1.2} trigger="in-view">
      <svg viewBox="0 0 100 100" fill="none" stroke="#7c3aed" strokeWidth={3}>
        <path d="M10 50 Q50 10 90 50 T10 50" />
      </svg>
    </DrawPath>
  )
}
