import { Marquee } from '@fethabo/animated-ui'

const LOGOS = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark', 'Wayne']

const chip = {
  padding: '10px 22px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.08)',
  fontWeight: 600,
  whiteSpace: 'nowrap',
}

export default {
  id: 'marquee',
  title: 'Marquee — cinta infinita sin costura (probá pauseOnHover y scrollVelocity scrolleando)',
  height: '40vh',
  controls: [
    { prop: 'direction', type: 'enum', options: ['left', 'right', 'up', 'down'], default: 'left' },
    { prop: 'speed', type: 'number', min: 10, max: 300, step: 10, default: 60 },
    { prop: 'gap', type: 'number', min: 8, max: 96, step: 4, default: 24 },
    { prop: 'pauseOnHover', type: 'boolean', default: true },
    { prop: 'fadeEdges', type: 'boolean', default: true },
    { prop: 'scrollVelocity', type: 'boolean', default: false },
  ],
  render: (props) => {
    const vertical = props.direction === 'up' || props.direction === 'down'
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <Marquee {...props} style={vertical ? { height: '100%', maxHeight: 380 } : { width: '100%' }}>
          {LOGOS.map((logo) => (
            <span key={logo} style={chip}>
              {logo}
            </span>
          ))}
        </Marquee>
      </div>
    )
  },
}
