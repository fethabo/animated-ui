import { MouseParallax } from '@fethabo/animated-ui/mouse-parallax'

export default function MouseParallaxDemo() {
  return (
    <MouseParallax className="docs-demo-stage" style={{ position: 'relative' }}>
      <MouseParallax.Layer depth={40}>
        <div style={{ fontSize: '4rem', opacity: 0.2, letterSpacing: '1.5rem' }}>✦ ✦ ✦</div>
      </MouseParallax.Layer>
      <MouseParallax.Layer depth={-16} style={{ position: 'absolute' }}>
        <div style={{ padding: '1.5rem 2rem', borderRadius: 14, background: '#12121f', border: '1px solid #2c2c4a', textAlign: 'center' }}>
          <strong>MouseParallax</strong>
          <p style={{ opacity: 0.7, margin: '4px 0 0' }}>el fondo sigue al mouse; el card se opone</p>
        </div>
      </MouseParallax.Layer>
    </MouseParallax>
  )
}
