import { Marquee } from '@fethabo/animated-ui/marquee'

const LOGOS = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark', 'Wayne']

export default function MarqueeDemo() {
  return (
    <div className="docs-demo-stage" style={{ width: '100%' }}>
      <Marquee speed={60} pauseOnHover fadeEdges style={{ width: '100%' }}>
        {LOGOS.map((logo) => (
          <span key={logo} style={{ padding: '10px 22px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {logo}
          </span>
        ))}
      </Marquee>
    </div>
  )
}
