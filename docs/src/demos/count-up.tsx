import { useState } from 'react'
import { CountUp } from '@fethabo/animated-ui/count-up'
import type { DemoControl } from '../content'

/** La cuenta corre una vez por montaje; el botón (o cambiar un control) re-monta
 *  cambiando la key. */
export default function CountUpDemo(props: Record<string, unknown>) {
  const [n, setN] = useState(0)
  const key = `${n}-${JSON.stringify(props)}`

  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '3rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
        <CountUp key={key} value={12500} separator="," prefix="$" suffix="+" {...props} />
      </div>
      <button
        type="button"
        onClick={() => setN((k) => k + 1)}
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

export const controls: DemoControl[] = [
  { prop: 'duration', type: 'number', min: 500, max: 5000, step: 100, default: 2000 },
  { prop: 'from', type: 'number', min: 0, max: 10000, step: 100, default: 0 },
  { prop: 'decimals', type: 'number', min: 0, max: 4, step: 1, default: 0 },
]
