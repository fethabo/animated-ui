import { WavyText } from '@fethabo/animated-ui/wavy-text'

export default function WavyTextDemo() {
  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2.6rem', fontWeight: 700, color: '#a78bfa' }}>
        <WavyText amplitude={8} speed={1.6}>
          floating letters
        </WavyText>
      </div>
    </div>
  )
}
