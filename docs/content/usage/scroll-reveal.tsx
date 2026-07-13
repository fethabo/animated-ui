import { ScrollReveal } from '@fethabo/animated-ui/scroll-reveal'

export function Example() {
  return (
    <ScrollReveal direction="up" stagger={0.1}>
      <h2>Appears on scroll</h2>
      <p>Each child staggers in.</p>
    </ScrollReveal>
  )
}
