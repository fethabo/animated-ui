import { SpotlightCard } from '@fethabo/animated-ui'

export default {
  id: 'spotlight-card',
  title: 'SpotlightCard — la luz sigue al cursor',
  height: '50vh',
  controls: [
    // `color` acepta rgba (con alpha), que <input type=color> no soporta: texto.
    { prop: 'color', type: 'text', label: 'color (rgba)', default: 'rgba(34, 211, 238, 0.2)' },
    { prop: 'radius', type: 'number', min: 80, max: 600, step: 10, default: 350 },
    { prop: 'opacity', type: 'number', min: 0, max: 1, step: 0.05, default: 1 },
  ],
  render: (props) => (
    <SpotlightCard
      {...props}
      style={{
        width: 320,
        padding: '3rem 2rem',
        borderRadius: 16,
        background: '#0f1a1f',
        border: '1px solid #333',
        position: 'relative',
      }}
    >
      <strong>SpotlightCard</strong>
      <p style={{ opacity: 0.7 }}>
        Mové el mouse: la luz te sigue. <a href="#spotlight-card">El contenido sigue clickeable.</a>
      </p>
    </SpotlightCard>
  ),
}
