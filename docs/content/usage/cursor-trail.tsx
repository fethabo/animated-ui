import { CursorTrail } from '@fethabo/animated-ui/cursor-trail'

export function Example() {
  return (
    <CursorTrail mode="line" color="#22d3ee" style={{ minHeight: 320 }}>
      <section>Movete por acá — los children siguen clickeables</section>
    </CursorTrail>
  )
}
