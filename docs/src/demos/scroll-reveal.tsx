import { ScrollReveal } from '@fethabo/animated-ui/scroll-reveal'

// once={false}: al scrollear la página el bloque se re-oculta y re-revela.
export default function ScrollRevealDemo() {
  return (
    <div className="docs-demo-stage">
      <ScrollReveal direction="up" stagger={0.12} once={false}>
        <h2 style={{ margin: '0 0 8px' }}>Appears on scroll</h2>
        <p style={{ margin: 0, opacity: 0.7 }}>Scrolleá la página: se re-revela al reentrar.</p>
      </ScrollReveal>
    </div>
  )
}
