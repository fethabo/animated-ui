import { BorderBeam } from '@fethabo/animated-ui'

export default {
  id: 'border-beam',
  title: 'BorderBeam — cometa recorriendo el borde (esquinas redondeadas incluidas)',
  height: '50vh',
  controls: [
    { prop: 'colorFrom', type: 'color', default: '#7c3aed' },
    { prop: 'colorTo', type: 'color', default: '#0ea5e9' },
    { prop: 'size', type: 'number', min: 20, max: 300, step: 10, default: 96 },
    { prop: 'duration', type: 'number', min: 1, max: 20, step: 0.5, default: 6 },
    { prop: 'delay', type: 'number', min: -10, max: 10, step: 0.5, default: 0 },
    { prop: 'borderWidth', type: 'number', min: 1, max: 8, step: 0.5, default: 2 },
  ],
  render: (props) => (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
      <BorderBeam
        {...props}
        style={{
          borderRadius: 18,
          padding: 28,
          maxWidth: 360,
          background: '#12121f',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h3 style={{ margin: '0 0 8px' }}>Card destacada</h3>
        <p style={{ margin: 0, opacity: 0.7 }}>
          El cometa sigue el perímetro con offset-path. Este botón queda clickeable:
        </p>
        <button style={{ marginTop: 12, padding: '6px 14px', borderRadius: 8 }} onClick={() => console.log('click')}>
          Probar click
        </button>
      </BorderBeam>
    </div>
  ),
}
