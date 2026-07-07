import { FlowField } from '@fethabo/animated-ui'

export default {
  id: 'flow-field',
  title: 'FlowField — partículas siguiendo un campo de ruido (pinta su propio fondo)',
  height: '80vh',
  controls: [
    { prop: 'count', type: 'number', min: 50, max: 1500, step: 50, default: 400 },
    { prop: 'speed', type: 'number', min: 0.25, max: 4, step: 0.25, default: 1 },
    {
      prop: 'colors',
      type: 'multi',
      options: ['#22d3ee', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'],
      asColors: true,
      default: ['#22d3ee', '#a78bfa', '#f472b6'],
    },
    { prop: 'fade', type: 'number', min: 0.5, max: 0.995, step: 0.005, default: 0.95 },
    { prop: 'scale', type: 'number', min: 40, max: 600, step: 20, default: 200 },
    { prop: 'background', type: 'color', default: '#0a0a12' },
    { prop: 'seed', type: 'text', default: 'aui' },
  ],
  render: (props) => (
    <div style={{ position: 'absolute', inset: 0 }}>
      <FlowField {...props} />
    </div>
  ),
}
