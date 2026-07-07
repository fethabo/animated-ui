import { TopographicBackground } from '@fethabo/animated-ui'

export default {
  id: 'topographic-background',
  title: 'TopographicBackground — curvas de nivel vivas (marching squares, seedable)',
  height: '80vh',
  controls: [
    { prop: 'levels', type: 'number', min: 2, max: 30, step: 1, default: 10 },
    { prop: 'color', type: 'color', default: '#38bdf8' },
    { prop: 'lineWidth', type: 'number', min: 0.5, max: 5, step: 0.5, default: 1 },
    { prop: 'scale', type: 'number', min: 60, max: 600, step: 20, default: 220 },
    { prop: 'speed', type: 'number', min: 0, max: 5, step: 0.25, default: 1 },
    { prop: 'seed', type: 'text', default: 'aui' },
  ],
  render: (props) => (
    <div style={{ position: 'absolute', inset: 0, background: '#0b1120' }}>
      <TopographicBackground {...props} />
    </div>
  ),
}
