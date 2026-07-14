import { StackedCards } from '@fethabo/animated-ui/stacked-cards'
import type { DemoControl } from '../content'

const CARDS = ['#7c3aed', '#0ea5e9', '#22c55e', '#f59e0b']

export default function StackedCardsDemo(props: Record<string, unknown>) {
  return (
    <StackedCards scaleStep={0.06} opacityStep={0.08} {...props}>
      {CARDS.map((bg, i) => (
        <article key={bg} style={{ height: 260, borderRadius: 16, background: bg, color: '#fff', display: 'grid', placeItems: 'center', fontSize: '1.6rem', fontWeight: 700 }}>
          Card {i + 1}
        </article>
      ))}
    </StackedCards>
  )
}

export const demoLayout = 'flow'

export const controls: DemoControl[] = [
  { prop: 'scaleStep', type: 'number', min: 0, max: 0.2, step: 0.01, default: 0.06 },
  { prop: 'opacityStep', type: 'number', min: 0, max: 0.3, step: 0.02, default: 0.08 },
  { prop: 'cardTravel', type: 'number', min: 200, max: 800, step: 50, default: 400 },
  { prop: 'offsetTop', type: 'number', min: 0, max: 120, step: 10, default: 0 },
]
