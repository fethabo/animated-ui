import { TextScrollReveal } from '@fethabo/animated-ui/text-scroll-reveal'
import type { DemoControl } from '../content'

// scroll-driven: el efecto necesita recorrido de scroll. El demo es alto por
// diseño (flow) con espaciadores antes y después del párrafo, para que el
// highlight progresivo sea observable de principio a fin.
export default function TextScrollRevealDemo(props: Record<string, unknown>) {
  return (
    <div>
      <div style={{ height: '70vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5, margin: 0 }}>Scrolleá ↓ (y volvé ↑ para verlo apagarse)</p>
      </div>
      <TextScrollReveal
        as="p"
        toColor="#e8e8f0"
        fromColor="#3a3a52"
        {...props}
        style={{ fontSize: '2rem', fontWeight: 600, maxWidth: 680, lineHeight: 1.4, margin: '0 auto', padding: '0 1.5rem' }}
      >
        Cada palabra de este párrafo se enciende en orden a medida que scrolleás, y
        se vuelve a apagar en orden inverso si scrolleás hacia atrás.
      </TextScrollReveal>
      <div style={{ height: '70vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5, margin: 0 }}>Fin del párrafo</p>
      </div>
    </div>
  )
}

export const demoLayout = 'flow'

export const controls: DemoControl[] = [
  { prop: 'fromColor', type: 'color', default: '#3a3a52' },
  { prop: 'toColor', type: 'color', default: '#e8e8f0' },
  { prop: 'fromOpacity', type: 'number', min: 0, max: 1, step: 0.05, default: 0.15 },
  { prop: 'toOpacity', type: 'number', min: 0, max: 1, step: 0.05, default: 1 },
]
