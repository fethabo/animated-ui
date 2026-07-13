import { AnimatedBackground } from '@fethabo/animated-ui/animated-background'

export function Example() {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <AnimatedBackground variant="aurora" speed={12} />
      <h2 style={{ position: 'relative' }}>Content over the aurora</h2>
    </div>
  )
}
