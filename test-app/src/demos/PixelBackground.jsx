import { PixelBackground } from '@fethabo/animated-ui'

export default {
  id: 'pixel-background',
  title: 'PixelBackground — hover + idle + reveal',
  height: '60vh',
  controls: [
    {
      prop: 'behaviors',
      type: 'multi',
      options: ['hover', 'idle', 'reveal'],
      default: ['hover', 'idle', 'reveal'],
    },
    { prop: 'color', type: 'color', default: '#22d3ee' },
    { prop: 'cellSize', type: 'number', min: 4, max: 32, step: 1, default: 12 },
    { prop: 'gap', type: 'number', min: 0, max: 12, step: 1, default: 2 },
    { prop: 'idleIntensity', type: 'number', min: 0, max: 1, step: 0.05, default: 0.25 },
    { prop: 'hoverRadius', type: 'number', min: 40, max: 300, step: 10, default: 150 },
  ],
  render: (props) => <PixelBackground {...props} />,
}
