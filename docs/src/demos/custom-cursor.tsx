import { CustomCursor } from '@fethabo/animated-ui/custom-cursor'
import type { DemoControl } from '../content'

export default function CustomCursorDemo(props: Record<string, unknown>) {
  return (
    <CustomCursor
      color="#0ea5e9"
      hoverScale={2}
      {...props}
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

export const controls: DemoControl[] = [
  { prop: 'color', type: 'color', default: '#0ea5e9' },
  { prop: 'dotSize', type: 'number', min: 2, max: 20, step: 1, default: 8 },
  { prop: 'ringSize', type: 'number', min: 10, max: 80, step: 2, default: 36 },
  { prop: 'hoverScale', type: 'number', min: 1, max: 4, step: 0.25, default: 2 },
  { prop: 'lag', type: 'number', min: 0, max: 1, step: 0.05, default: 0.15 },
  { prop: 'hideNativeCursor', type: 'boolean', default: true },
]
