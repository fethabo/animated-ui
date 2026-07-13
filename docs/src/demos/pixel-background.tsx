import { PixelBackground } from '@fethabo/animated-ui/pixel-background'

export default function PixelBackgroundDemo() {
  return (
    <div style={{ position: 'relative', minHeight: 320 }}>
      <PixelBackground behaviors={['hover', 'idle']} color="#7c3aed" cellSize={14} />
    </div>
  )
}
