import { CircuitBackground } from '@fethabo/animated-ui'

export default {
  id: 'circuit-background',
  title: 'CircuitBackground — circuito PCB procedural con pulsos de luz',
  height: '80vh',
  controls: [
    { prop: 'seed', type: 'text', default: 'hero' },
    { prop: 'density', type: 'number', min: 0.3, max: 4, step: 0.1, default: 1.2 },
    { prop: 'trackColor', type: 'color', default: '#1e3a5f' },
    { prop: 'pulseColor', type: 'color', default: '#22d3ee' },
    { prop: 'pulseSpeed', type: 'number', min: 20, max: 300, step: 10, default: 90 },
    { prop: 'pulseCount', type: 'number', min: 0, max: 40, step: 1, default: 10 },
    { prop: 'lineWidth', type: 'number', min: 1, max: 6, step: 1, default: 2 },
  ],
  render: (props) => (
    <div style={{ position: 'absolute', inset: 0, background: '#050a14' }}>
      <CircuitBackground {...props} />
    </div>
  ),
}
