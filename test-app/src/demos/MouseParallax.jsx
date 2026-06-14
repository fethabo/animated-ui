import { MouseParallax } from '@fethabo/animated-ui'

export default {
  id: 'mouse-parallax',
  title: 'MouseParallax — capas con profundidades opuestas',
  height: '70vh',
  controls: [{ prop: 'ease', type: 'number', min: 0, max: 1, step: 0.05, default: 0.2 }],
  // Las capas demo (con sus depths) quedan fijas; el root expone `ease`.
  render: (props) => (
    <MouseParallax {...props} style={{ width: '100%', minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
      <MouseParallax.Layer depth={40}>
        <div style={{ fontSize: '4rem', opacity: 0.25, letterSpacing: '2rem' }}>✦ ✦ ✦</div>
      </MouseParallax.Layer>
      <MouseParallax.Layer depth={-15} style={{ position: 'absolute' }}>
        <div
          style={{
            padding: '2rem 3rem',
            borderRadius: 16,
            background: '#12121f',
            border: '1px solid #333',
            textAlign: 'center',
          }}
        >
          <strong>MouseParallax</strong>
          <p style={{ opacity: 0.7, margin: 0 }}>El fondo sigue al mouse; este card se opone.</p>
        </div>
      </MouseParallax.Layer>
    </MouseParallax>
  ),
}
