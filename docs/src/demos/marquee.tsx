import { Marquee } from '@fethabo/animated-ui/marquee'
import type { DemoControl } from '../content'

const LOGOS = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark', 'Wayne']

export default function MarqueeDemo(props: Record<string, unknown>) {
  const vertical = props.direction === 'up' || props.direction === 'down'
  // Contenedor absoluto que llena el frame: el marquee tiene un ancho/alto
  // medible y estable desde el primer paint (evita medir sobre tamaño 0).
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 24 }}>
      <Marquee
        speed={60}
        pauseOnHover
        fadeEdges
        {...props}
        style={vertical ? { height: '100%', maxHeight: 300 } : { width: '100%' }}
      >
        {LOGOS.map((logo) => (
          <span
            key={logo}
            style={{
              padding: '10px 22px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.08)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {logo}
          </span>
        ))}
      </Marquee>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'direction', type: 'enum', options: ['left', 'right', 'up', 'down'], default: 'left' },
  { prop: 'speed', type: 'number', min: 10, max: 200, step: 10, default: 60 },
  { prop: 'pauseOnHover', type: 'boolean', default: true },
  { prop: 'fadeEdges', type: 'boolean', default: true },
  { prop: 'gap', type: 'number', min: 8, max: 96, step: 4, default: 24 },
  { prop: 'scrollVelocity', type: 'boolean', default: false },
]
