import { StackedCards } from '@fethabo/animated-ui'

const COLORS = ['#7c3aed', '#db2777', '#2563eb', '#0d9488']

// El contenedor es alto por diseño (sticky scroll), así que su panel se ancla
// a la primera pantalla (bare, como StickyScenes).
export default {
  id: 'stacked-cards',
  title: 'StackedCards',
  bare: true,
  controls: [
    { prop: 'offsetTop', type: 'number', min: 0, max: 200, step: 10, default: 40 },
    { prop: 'scaleStep', type: 'number', min: 0, max: 0.2, step: 0.01, default: 0.05 },
    { prop: 'opacityStep', type: 'number', min: 0, max: 0.5, step: 0.05, default: 0.15 },
    { prop: 'cardTravel', type: 'number', min: 200, max: 800, step: 20, default: 420 },
  ],
  render: (props) => (
    <div>
      <div style={{ height: '40vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Scrolleá ↓</p>
      </div>
      <StackedCards {...props} style={{ padding: '0 2rem' }}>
        {COLORS.map((color, i) => (
          <div
            key={i}
            style={{
              height: '100%',
              borderRadius: 24,
              background: color,
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.4)',
              color: '#fff',
            }}
          >
            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Card {i + 1}</h2>
          </div>
        ))}
      </StackedCards>
      <div style={{ height: '40vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Fin del stack</p>
      </div>
    </div>
  ),
}
