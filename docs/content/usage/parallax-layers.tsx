import { ParallaxLayers } from '@fethabo/animated-ui/parallax-layers'

export function Example() {
  return (
    <ParallaxLayers style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <ParallaxLayers.Layer depth={80}>
        <div style={{ fontSize: '4rem', opacity: 0.2 }}>backdrop</div>
      </ParallaxLayers.Layer>
      <ParallaxLayers.Layer depth={-30} style={{ position: 'absolute' }}>
        <strong>foreground</strong>
      </ParallaxLayers.Layer>
    </ParallaxLayers>
  )
}
