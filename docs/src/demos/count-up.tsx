import { useState } from 'react'
import { CountUp } from '@fethabo/animated-ui/count-up'

/** La cuenta corre una vez por montaje; el botón re-monta cambiando la key. */
export default function CountUpDemo() {
  const [key, setKey] = useState(0)

  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '3rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
        <CountUp key={key} value={12500} separator="," prefix="$" suffix="+" />
      </div>
      <button
        type="button"
        onClick={() => setKey((k) => k + 1)}
        style={{
          font: 'inherit',
          fontWeight: 600,
          padding: '8px 20px',
          borderRadius: 8,
          border: '1px solid #2c2c4a',
          background: 'transparent',
          color: '#e8e8f0',
          cursor: 'pointer',
        }}
      >
        replay
      </button>
    </div>
  )
}
