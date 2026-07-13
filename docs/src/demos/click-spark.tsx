import { ClickSpark } from '@fethabo/animated-ui/click-spark'

export default function ClickSparkDemo() {
  return (
    <ClickSpark
      colors={['#fbbf24', '#f59e0b', '#fde68a']}
      count={10}
      radius={50}
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
