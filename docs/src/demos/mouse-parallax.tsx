import { MouseParallax } from '@fethabo/animated-ui/mouse-parallax'
import type { DemoControl } from '../content'

export default function MouseParallaxDemo(props: Record<string, unknown>) {
  const { depth = 40, ...rest } = props as { depth?: number }
  return (
    <MouseParallax className="docs-demo-stage" style={{ position: 'relative' }} {...rest}>
      <MouseParallax.Layer depth={depth}>
        <div style={{ fontSize: '4rem', opacity: 0.2, letterSpacing: '1.5rem' }}>✦ ✦ ✦</div>
      </MouseParallax.Layer>
      <MouseParallax.Layer depth={-16} style={{ position: 'absolute' }}>
        <div
          style={{
            padding: '1.5rem 2rem',
            borderRadius: 14,
            background: '#12121f',
            border: '1px solid #2c2c4a',
            textAlign: 'center',
          }}
        >
          <strong>MouseParallax</strong>
          <p style={{ opacity: 0.7, margin: '4px 0 0' }}>el fondo sigue al mouse; el card se opone</p>
        </div>
      </MouseParallax.Layer>
    </MouseParallax>
  )
}

export const controls: DemoControl[] = [
  { prop: 'ease', type: 'number', min: 0, max: 1, step: 0.05, default: 0.2 },
  // `depth` es de MouseParallax.Layer; el demo lo aplica a la capa de fondo.
  { prop: 'depth', type: 'number', min: -80, max: 80, step: 4, default: 40 },
]
