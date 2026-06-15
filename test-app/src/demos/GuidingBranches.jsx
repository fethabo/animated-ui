import { GuidingBranches } from '@fethabo/animated-ui'

export default {
  id: 'guiding-branches',
  title: 'GuidingBranches — dejá el mouse quieto: el trazo se expande 360°',
  height: '80vh',
  controls: [
    { prop: 'aesthetic', type: 'enum', options: ['roots', 'lightning', 'circuit'], default: 'roots' },
    { prop: 'idleDelay', type: 'number', min: 500, max: 5000, step: 100, default: 1200 },
    { prop: 'color', type: 'color', default: '#34d399' },
    { prop: 'speed', type: 'number', min: 80, max: 1000, step: 20, default: 320 },
    { prop: 'maxDistance', type: 'number', min: 100, max: 600, step: 10, default: 280 },
    { prop: 'duration', type: 'number', min: 300, max: 3000, step: 100, default: 1400 },
    { prop: 'density', type: 'number', min: 1, max: 10, step: 1, default: 4 },
    { prop: 'depth', type: 'number', min: 0, max: 6, step: 1, default: 3 },
    { prop: 'lineWidth', type: 'number', min: 1, max: 6, step: 1, default: 2 },
    { prop: 'curl', type: 'number', min: 0, max: 1, step: 0.05, default: 0.6 },
    { prop: 'loop', type: 'boolean', default: false },
  ],
  // Modo ambient (sin target): interacción del puntero pausado con su entorno,
  // expandiéndose en todas direcciones hasta la frontera (maxDistance).
  render: (props) => (
    <div style={{ position: 'absolute', inset: 0, background: '#07120d' }}>
      <GuidingBranches {...props}>
        <div style={{ position: 'relative', height: '100%', color: '#dfe', fontFamily: 'system-ui' }}>
          <p style={{ padding: 24 }}>Dejá el mouse quieto en cualquier lugar: el trazo se expande a su alrededor.</p>
        </div>
      </GuidingBranches>
    </div>
  ),
}
