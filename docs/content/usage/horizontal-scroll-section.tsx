import { HorizontalScrollSection } from '@fethabo/animated-ui/horizontal-scroll-section'

export function Example() {
  return (
    <HorizontalScrollSection speed={1}>
      <section style={{ width: '100vw', height: '100dvh' }}>Panel 1</section>
      <section style={{ width: '100vw', height: '100dvh' }}>Panel 2</section>
      <section style={{ width: '100vw', height: '100dvh' }}>Panel 3</section>
    </HorizontalScrollSection>
  )
}
