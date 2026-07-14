import { ClickSpark } from '@fethabo/animated-ui/click-spark'
import type { DemoControl } from '../content'

export default function ClickSparkDemo(props: Record<string, unknown>) {
  return (
    <ClickSpark
      colors={['#fbbf24', '#f59e0b', '#fde68a']}
      count={10}
      radius={50}
      {...props}
      style={{
        minHeight: 340,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 12,
        background: '#0a0a12',
        color: '#a1a1aa',
      }}
    >
      <div style={{ textAlign: 'center', display: 'grid', gap: 16, placeItems: 'center' }}>
        <p style={{ margin: 0 }}>clickeá en cualquier punto</p>
        <button
          type="button"
          style={{
            font: 'inherit',
            fontWeight: 600,
            padding: '10px 26px',
            borderRadius: 10,
            border: 'none',
            background: '#7c3aed',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          botón interactivo
        </button>
      </div>
    </ClickSpark>
  )
}

export const controls: DemoControl[] = [
  { prop: 'count', type: 'number', min: 3, max: 24, step: 1, default: 10 },
  { prop: 'radius', type: 'number', min: 20, max: 120, step: 5, default: 50 },
  { prop: 'size', type: 'number', min: 1, max: 8, step: 0.5, default: 2 },
  { prop: 'duration', type: 'number', min: 200, max: 1200, step: 50, default: 500 },
  {
    prop: 'colors',
    type: 'multi',
    asColors: true,
    options: ['#fbbf24', '#f59e0b', '#fde68a', '#7c3aed', '#0ea5e9', '#ec4899', '#10b981'],
    default: ['#fbbf24', '#f59e0b', '#fde68a'],
  },
]
