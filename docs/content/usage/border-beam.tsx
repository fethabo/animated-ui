import { BorderBeam } from '@fethabo/animated-ui/border-beam'

export function Example() {
  return (
    <BorderBeam duration={8} colorFrom="#f59e0b" style={{ borderRadius: 16, padding: 24 }}>
      <h3>Featured card</h3>
      <p>A comet traces the border.</p>
    </BorderBeam>
  )
}
