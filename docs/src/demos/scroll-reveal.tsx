import { ScrollReveal } from '@fethabo/animated-ui/scroll-reveal'
import type { DemoControl } from '../content'

// once={false}: al scrollear la página el bloque se re-oculta y re-revela.
export default function ScrollRevealDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <ScrollReveal direction="up" stagger={0.12} once={false} {...props}>
        <h2 style={{ margin: '0 0 8px' }}>Appears on scroll</h2>
        <p style={{ margin: 0, opacity: 0.7 }}>Scrolleá la página: se re-revela al reentrar.</p>
      </ScrollReveal>
    </div>
  )
}

export const controls: DemoControl[] = [
  {
    prop: 'direction',
    type: 'enum',
    options: ['up', 'down', 'left', 'right', 'none'],
    default: 'up',
  },
  { prop: 'distance', type: 'number', min: 0, max: 100, step: 4, default: 24 },
  { prop: 'stagger', type: 'number', min: 0, max: 0.4, step: 0.02, default: 0.12 },
  { prop: 'duration', type: 'number', min: 0.1, max: 1.5, step: 0.1, default: 0.6 },
  { prop: 'threshold', type: 'number', min: 0, max: 1, step: 0.05, default: 0.15 },
  { prop: 'once', type: 'boolean', default: false },
]
