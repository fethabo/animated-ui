import { SpotlightCard } from '@fethabo/animated-ui/spotlight-card'

export function Example() {
  return (
    <SpotlightCard
      color="rgba(34, 211, 238, 0.2)"
      radius={300}
      style={{ padding: 24, borderRadius: 16, background: '#0f1a1f', border: '1px solid #333' }}
    >
      <h3>My card</h3>
      <p>The light follows the cursor. <a href="#">This link stays clickable.</a></p>
    </SpotlightCard>
  )
}
