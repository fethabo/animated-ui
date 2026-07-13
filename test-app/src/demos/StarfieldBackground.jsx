import { StarfieldBackground } from '@fethabo/animated-ui'

export default {
  id: 'starfield-background',
  title: 'StarfieldBackground — cielo estrellado con titileo y fugaces (seedable)',
  height: '80vh',
  controls: [
    { prop: 'seed', type: 'text', default: 'aui' },
    { prop: 'density', type: 'number', min: 0.25, max: 4, step: 0.25, default: 1 },
    {
      prop: 'colors',
      type: 'multi',
      options: ['#ffffff', '#bfdbfe', '#fde68a', '#f0abfc', '#a5f3fc'],
      asColors: true,
      default: ['#ffffff', '#bfdbfe', '#fde68a'],
    },
    { prop: 'background', type: 'color', default: '#050514' },
    { prop: 'speed', type: 'number', min: 0, max: 4, step: 0.25, default: 1 },
    { prop: 'shootingStars', type: 'number', min: 0, max: 60, step: 2, default: 8 },
  ],
  render: (props) => (
    <div style={{ position: 'absolute', inset: 0 }}>
      <StarfieldBackground {...props} />
    </div>
  ),
}
