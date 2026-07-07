import { RotatingText } from '@fethabo/animated-ui'

export default {
  id: 'rotating-text',
  title: 'RotatingText — rotación con layout estable (anchos dispares a propósito)',
  height: '40vh',
  controls: [
    { prop: 'transition', type: 'enum', options: ['slide-up', 'fade', 'flip'], default: 'slide-up' },
    { prop: 'interval', type: 'number', min: 500, max: 6000, step: 100, default: 2200 },
    { prop: 'duration', type: 'number', min: 0.1, max: 1.5, step: 0.05, default: 0.4 },
    { prop: 'color', type: 'color', default: '#a78bfa' },
    { prop: 'loop', type: 'boolean', default: true },
  ],
  render: (props) => (
    <h1 style={{ fontSize: '2.5rem' }}>
      <RotatingText {...props} words={['webs', 'aplicaciones', 'magia', 'experiencias increíbles']}>
        Hacemos{' '}
      </RotatingText>
    </h1>
  ),
}
