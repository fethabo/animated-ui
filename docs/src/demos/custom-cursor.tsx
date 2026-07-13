import { CustomCursor } from '@fethabo/animated-ui/custom-cursor'

export default function CustomCursorDemo() {
  return (
    <CustomCursor
      color="#0ea5e9"
      hoverScale={2}
      style={{
        minHeight: 340,
        display: 'grid',
        placeItems: 'center',
        alignContent: 'center',
        gap: 20,
        borderRadius: 12,
        background: '#0a0a12',
        color: '#e5e7eb',
      }}
    >
      <p style={{ margin: 0, opacity: 0.65 }}>
        idle &rarr; hover (sobre interactivos) &rarr; down
      </p>
      <button
        type="button"
        style={{
          font: 'inherit',
          fontWeight: 600,
          padding: '10px 26px',
          borderRadius: 10,
          border: '1px solid #2c2c4a',
          background: '#12121f',
          color: '#e5e7eb',
        }}
      >
        el anillo se agranda acá
      </button>
      <div
        data-aui-cursor
        style={{ padding: '10px 24px', borderRadius: 10, border: '1px dashed #7c3aed' }}
      >
        data-aui-cursor
      </div>
    </CustomCursor>
  )
}
