import { ParallaxLayers } from '@fethabo/animated-ui/parallax-layers'

// scroll-driven: al scrollear la página las capas se separan por profundidad.
export default function ParallaxLayersDemo() {
  return (
    <ParallaxLayers style={{ minHeight: 480, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <ParallaxLayers.Layer depth={90}>
        <div style={{ fontSize: '5rem', opacity: 0.18, textAlign: 'center', letterSpacing: '1.5rem' }}>✦ ✦ ✦</div>
      </ParallaxLayers.Layer>
      <ParallaxLayers.Layer depth={-34} style={{ position: 'absolute' }}>
        <div style={{ padding: '1.5rem 2rem', borderRadius: 14, background: '#12121f', border: '1px solid #2c2c4a', textAlign: 'center' }}>
          <strong>ParallaxLayers</strong>
          <p style={{ opacity: 0.7, margin: '4px 0 0' }}>scrolleá la página</p>
        </div>
      </ParallaxLayers.Layer>
    </ParallaxLayers>
  )
}
