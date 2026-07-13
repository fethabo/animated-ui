import { TiltCard } from '@fethabo/animated-ui/tilt-card'

export function Example() {
  return (
    <TiltCard glare maxAngle={12} style={{ borderRadius: 16, padding: 24 }}>
      <h3>My card</h3>
      <p>Tilts toward the mouse.</p>
    </TiltCard>
  )
}
