import { GlowBorder } from '@fethabo/animated-ui/glow-border'

export function Example() {
  return (
    <GlowBorder
      width={2}
      radius={16}
      colors={['#22d3ee', '#a78bfa']}
      contentStyle={{ background: '#12121f', padding: '2rem' }}
    >
      <h3>My content</h3>
      <p>The gradient ring glows around the edge.</p>
    </GlowBorder>
  )
}
