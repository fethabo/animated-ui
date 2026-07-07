import { WavesBackground } from '@fethabo/animated-ui'

export default {
  id: 'waves-background',
  title: 'WavesBackground — líneas fluidas con ruido simplex (seedable)',
  height: '80vh',
  controls: [
    { prop: 'lines', type: 'number', min: 4, max: 80, step: 2, default: 24 },
    { prop: 'amplitude', type: 'number', min: 4, max: 120, step: 4, default: 24 },
    { prop: 'speed', type: 'number', min: 0, max: 5, step: 0.25, default: 1 },
    {
      prop: 'colors',
      type: 'multi',
      options: ['#22d3ee', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'],
      asColors: true,
      default: ['#22d3ee', '#a78bfa'],
    },
    { prop: 'lineWidth', type: 'number', min: 0.5, max: 6, step: 0.5, default: 1.5 },
    { prop: 'seed', type: 'text', default: 'aui' },
  ],
  render: (props) => (
    <div style={{ position: 'absolute', inset: 0, background: '#050510' }}>
      <WavesBackground {...props} />
    </div>
  ),
}
