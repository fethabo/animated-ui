import { StackedCards } from '@fethabo/animated-ui/stacked-cards'

export function Example() {
  return (
    <StackedCards scaleStep={0.05}>
      <article>Card 1</article>
      <article>Card 2</article>
      <article>Card 3</article>
    </StackedCards>
  )
}
