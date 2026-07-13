import { TextScrollReveal } from '@fethabo/animated-ui'

const TEXTO =
  'Cada palabra de este párrafo se enciende en orden a medida que scrolleás, y se vuelve a apagar en orden inverso si scrolleás hacia atrás — el progreso vive en una sola CSS var y cada palabra se resuelve con calc().'

// El efecto necesita recorrido de scroll: el demo es alto por diseño (bare)
// con espaciadores antes y después del párrafo.
export default {
  id: 'text-scroll-reveal',
  title: 'TextScrollReveal — highlight progresivo por scroll',
  bare: true,
  controls: [
    { prop: 'fromOpacity', type: 'number', min: 0, max: 0.6, step: 0.05, default: 0.15 },
    { prop: 'toOpacity', type: 'number', min: 0.4, max: 1, step: 0.05, default: 1 },
    { prop: 'fromColor', type: 'color', default: '#4b5563' },
    { prop: 'toColor', type: 'color', default: '#f8fafc' },
  ],
  render: (props) => (
    <div>
      <div style={{ height: '70vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Scrolleá ↓ (y volvé ↑ para verlo apagarse)</p>
      </div>
      <TextScrollReveal
        {...props}
        style={{
          maxWidth: 680,
          margin: '0 auto',
          fontSize: '2rem',
          fontWeight: 600,
          lineHeight: 1.4,
          padding: '0 1.5rem',
        }}
      >
        {TEXTO}
      </TextScrollReveal>
      <div style={{ height: '70vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Fin del párrafo</p>
      </div>
    </div>
  ),
}
