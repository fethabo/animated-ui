import { CursorTrail } from '@fethabo/animated-ui/cursor-trail'

export default function CursorTrailDemo() {
  return (
    <CursorTrail
      mode="line"
      color="#0ea5e9"
      colors={['#0ea5e9', '#7c3aed', '#22d3ee']}
      size={10}
      style={{
        minHeight: 340,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 12,
        background: '#0a0a12',
      }}
    >
      <p style={{ margin: 0, opacity: 0.65 }}>move your cursor around</p>
    </CursorTrail>
  )
}
