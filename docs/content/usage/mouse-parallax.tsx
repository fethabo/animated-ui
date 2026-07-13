import { MouseParallax } from '@fethabo/animated-ui/mouse-parallax'

export function Example() {
  return (
    <MouseParallax style={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
      <MouseParallax.Layer depth={40}>
        <div style={{ fontSize: '3rem', opacity: 0.25 }}>backdrop</div>
      </MouseParallax.Layer>
      <MouseParallax.Layer depth={-15} style={{ position: 'absolute' }}>
        <strong>foreground card</strong>
      </MouseParallax.Layer>
    </MouseParallax>
  )
}
