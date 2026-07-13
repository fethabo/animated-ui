import { StarfieldBackground } from '@fethabo/animated-ui/starfield-background'

export function Example() {
  return (
    <section style={{ position: 'relative', minHeight: 320 }}>
      <StarfieldBackground density={1} shootingStars={8} />
    </section>
  )
}
