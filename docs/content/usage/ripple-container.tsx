import { RippleContainer } from '@fethabo/animated-ui/ripple-container'

export function Example() {
  return (
    <RippleContainer color="rgba(255,255,255,0.5)" duration={700} style={{ borderRadius: 12 }}>
      <button style={{ padding: '1rem 2.5rem', borderRadius: 12 }}>Click me</button>
    </RippleContainer>
  )
}
