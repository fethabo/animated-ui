import { CustomCursor } from '@fethabo/animated-ui'

export default {
  id: 'custom-cursor',
  title: 'CustomCursor — dot + anillo con lag que reemplaza al cursor nativo (scoped)',
  height: '60vh',
  controls: [
    { prop: 'dotSize', type: 'number', min: 4, max: 20, step: 1, default: 8 },
    { prop: 'ringSize', type: 'number', min: 16, max: 80, step: 4, default: 36 },
    { prop: 'color', type: 'color', default: '#7c3aed' },
    { prop: 'lag', type: 'number', min: 0, max: 0.6, step: 0.05, default: 0.15 },
    { prop: 'hoverScale', type: 'number', min: 1, max: 3, step: 0.25, default: 1.5 },
    { prop: 'hideNativeCursor', type: 'boolean', default: true },
  ],
  render: (props) => (
    <CustomCursor
      {...props}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        alignContent: 'center',
        gap: '1.5rem',
        background: '#0f0f1a',
        color: '#e5e5e5',
      }}
    >
      <p style={{ margin: 0 }}>
        Estados: idle → hover (sobre interactivos) → down (presionando)
      </p>
      <button
        style={{
          padding: '1rem 2.5rem',
          borderRadius: 12,
          border: '1px solid #444',
          background: '#1e1b2e',
          color: '#e5e5e5',
          fontSize: '1rem',
        }}
      >
        Botón (hover agranda el anillo)
      </button>
      <a href="#custom-cursor" style={{ color: '#a78bfa' }}>
        Un link también cuenta
      </a>
      <div
        data-aui-cursor
        style={{
          padding: '0.75rem 2rem',
          borderRadius: 12,
          border: '1px dashed #555',
        }}
      >
        Elemento con data-aui-cursor
      </div>
    </CustomCursor>
  ),
}
