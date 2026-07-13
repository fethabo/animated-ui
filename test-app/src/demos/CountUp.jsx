import { CountUp } from '@fethabo/animated-ui'

export default {
  id: 'count-up',
  title: 'CountUp — stats que cuentan al entrar al viewport',
  height: '50vh',
  controls: [
    { prop: 'value', type: 'number', min: 0, max: 100000, step: 500, default: 12500 },
    { prop: 'from', type: 'number', min: 0, max: 50000, step: 500, default: 0 },
    { prop: 'duration', type: 'number', min: 200, max: 6000, step: 100, default: 2000 },
    { prop: 'decimals', type: 'number', min: 0, max: 3, step: 1, default: 0 },
    { prop: 'separator', type: 'text', default: '.' },
    { prop: 'prefix', type: 'text', default: '' },
    { prop: 'suffix', type: 'text', default: '+' },
  ],
  // La cuenta corre una vez por montaje: la key remonta el componente al
  // tocar cualquier control, para re-verificar la animación sin recargar.
  render: (props) => (
    <div style={{ display: 'flex', gap: '4rem', textAlign: 'center' }}>
      <p style={{ margin: 0 }}>
        <CountUp
          key={JSON.stringify(props)}
          {...props}
          style={{
            display: 'block',
            fontSize: '3.5rem',
            fontWeight: 700,
            color: '#38bdf8',
            fontVariantNumeric: 'tabular-nums',
          }}
        />
        <span style={{ opacity: 0.6 }}>controlado por el panel</span>
      </p>
      <p style={{ margin: 0 }}>
        <CountUp
          value={99.9}
          decimals={1}
          suffix="%"
          duration={2500}
          respectReducedMotion={props.respectReducedMotion}
          style={{
            display: 'block',
            fontSize: '3.5rem',
            fontWeight: 700,
            color: '#4ade80',
            fontVariantNumeric: 'tabular-nums',
          }}
        />
        <span style={{ opacity: 0.6 }}>uptime (decimales estables)</span>
      </p>
    </div>
  ),
}
