import { FlowField } from '@fethabo/animated-ui/flow-field'

export function Example() {
  return (
    <section style={{ position: 'relative', minHeight: 320 }}>
      <FlowField count={400} colors={['#22d3ee', '#a78bfa', '#f472b6']} />
    </section>
  )
}
