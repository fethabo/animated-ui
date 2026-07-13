import { CircuitBackground } from '@fethabo/animated-ui/circuit-background'

export function Example() {
  return (
    <section style={{ position: 'relative', minHeight: 320 }}>
      <CircuitBackground pulseColor="#22d3ee" pulseCount={8} />
    </section>
  )
}
