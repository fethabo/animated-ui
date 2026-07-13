import { WavesBackground } from '@fethabo/animated-ui/waves-background'

export default function WavesBackgroundDemo() {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <WavesBackground lines={26} amplitude={28} colors={['#22d3ee', '#a78bfa']} />
    </div>
  )
}
