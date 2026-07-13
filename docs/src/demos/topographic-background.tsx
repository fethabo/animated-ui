import { TopographicBackground } from '@fethabo/animated-ui/topographic-background'

export default function TopographicBackgroundDemo() {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <TopographicBackground levels={12} color="#38bdf8" scale={220} />
    </div>
  )
}
