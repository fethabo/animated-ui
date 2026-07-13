import { ParticleField } from '@fethabo/animated-ui/particle-field'

export function Example() {
  return (
    <section style={{ position: 'relative', minHeight: 320 }}>
      <ParticleField count={80} links cursorInteraction="repel" />
    </section>
  )
}
