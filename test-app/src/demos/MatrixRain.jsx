import { MatrixRain } from '@fethabo/animated-ui'

export default {
  id: 'matrix-rain',
  title: 'MatrixRain — lluvia de glifos por columnas (code rain, seedable)',
  height: '80vh',
  controls: [
    { prop: 'seed', type: 'text', default: 'aui' },
    { prop: 'charset', type: 'text', default: '' },
    { prop: 'color', type: 'color', default: '#22c55e' },
    { prop: 'headColor', type: 'color', default: '#d9ffe3' },
    { prop: 'background', type: 'color', default: '#040905' },
    { prop: 'fontSize', type: 'number', min: 10, max: 48, step: 2, default: 16 },
    { prop: 'speed', type: 'number', min: 0.25, max: 4, step: 0.25, default: 1 },
  ],
  // charset vacío en el panel = default del componente (ASCII + katakana).
  render: ({ charset, ...props }) => (
    <div style={{ position: 'absolute', inset: 0 }}>
      <MatrixRain {...props} charset={charset || undefined} />
    </div>
  ),
}
