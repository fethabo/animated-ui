import { MagneticElement } from '@fethabo/animated-ui/magnetic-element'

export function Example() {
  return (
    <MagneticElement strength={0.5} hitArea={60}>
      <button
        style={{ padding: '12px 32px', borderRadius: 9999, border: 'none', background: '#7c3aed', color: '#fff' }}
      >
        Catch me
      </button>
    </MagneticElement>
  )
}
