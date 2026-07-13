import { WavesBackground } from '@fethabo/animated-ui/waves-background'

export function Example() {
  return (
    <section style={{ position: 'relative', minHeight: 320 }}>
      <WavesBackground lines={28} amplitude={30} colors={['#22d3ee', '#a78bfa']} />
      <h2 style={{ position: 'relative' }}>Content over the waves</h2>
    </section>
  )
}
