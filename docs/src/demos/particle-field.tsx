import { ParticleField } from '@fethabo/animated-ui/particle-field'

export default function ParticleFieldDemo() {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <ParticleField count={90} links color="#7c3aed" cursorInteraction="repel" />
    </div>
  )
}
