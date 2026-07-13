import { StackedCards } from '@fethabo/animated-ui/stacked-cards'

const CARDS = ['#7c3aed', '#0ea5e9', '#22c55e', '#f59e0b']

export default function StackedCardsDemo() {
  return (
    <StackedCards scaleStep={0.06} opacityStep={0.08}>
      {CARDS.map((bg, i) => (
        <article key={bg} style={{ height: 260, borderRadius: 16, background: bg, color: '#fff', display: 'grid', placeItems: 'center', fontSize: '1.6rem', fontWeight: 700 }}>
          Card {i + 1}
        </article>
      ))}
    </StackedCards>
  )
}

export const demoLayout = 'flow'
