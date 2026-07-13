import { TopographicBackground } from '@fethabo/animated-ui/topographic-background'

export function Example() {
  return (
    <section style={{ position: 'relative', minHeight: 320 }}>
      <TopographicBackground levels={12} color="#38bdf8" />
    </section>
  )
}
