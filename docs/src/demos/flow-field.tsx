import { FlowField } from '@fethabo/animated-ui/flow-field'

export default function FlowFieldDemo() {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <FlowField count={500} colors={['#22d3ee', '#a78bfa', '#f472b6']} background="#0a0a12" />
    </div>
  )
}
