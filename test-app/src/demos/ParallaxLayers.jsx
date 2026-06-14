import { ParallaxLayers } from '@fethabo/animated-ui'

export default {
  id: 'parallax-layers',
  title: 'ParallaxLayers — capas ligadas al scroll (mirá los bordes al scrollear)',
  height: '90vh',
  // El root solo expone respectReducedMotion (lo inyecta el panel). Las capas
  // demo y sus depths quedan fijas.
  controls: [],
  render: (props) => (
    <ParallaxLayers
      {...props}
      style={{ width: '100%', minHeight: '70vh', overflow: 'hidden', display: 'grid', placeItems: 'center' }}
    >
      <ParallaxLayers.Layer depth={80}>
        <div style={{ margin: '-15% 0', fontSize: '5rem', opacity: 0.2, textAlign: 'center', letterSpacing: '1.5rem' }}>
          ✦ ✦ ✦<br />✦ ✦ ✦<br />✦ ✦ ✦
        </div>
      </ParallaxLayers.Layer>
      <ParallaxLayers.Layer depth={-30} style={{ position: 'absolute' }}>
        <div
          style={{
            padding: '2rem 3rem',
            borderRadius: 16,
            background: '#12121f',
            border: '1px solid #333',
            textAlign: 'center',
          }}
        >
          <strong>ParallaxLayers</strong>
          <p style={{ opacity: 0.7, margin: 0 }}>El fondo acompaña al scroll; este card va en contra.</p>
        </div>
      </ParallaxLayers.Layer>
    </ParallaxLayers>
  ),
}
