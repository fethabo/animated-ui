import { StarfieldBackground } from '@fethabo/animated-ui/starfield-background'

export default function StarfieldBackgroundDemo() {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <StarfieldBackground density={1.2} shootingStars={12} />
    </div>
  )
}
