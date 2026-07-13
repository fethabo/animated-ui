import { PixelBackground } from '@fethabo/animated-ui/pixel-background'

export function Example() {
  return (
    <section style={{ position: 'relative', minHeight: 320 }}>
      <PixelBackground behaviors={['hover', 'idle']} color="#7c3aed" />
      <h2 style={{ position: 'relative' }}>Move the mouse over the grid</h2>
    </section>
  )
}
