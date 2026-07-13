import { CircuitBackground } from '@fethabo/animated-ui/circuit-background'

export default function CircuitBackgroundDemo() {
  return (
    <div style={{ position: 'relative', minHeight: 320, background: '#050b16' }}>
      <CircuitBackground trackColor="#1e3a5f" pulseColor="#22d3ee" pulseCount={10} />
    </div>
  )
}
