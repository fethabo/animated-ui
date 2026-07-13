import { TypewriterText } from '@fethabo/animated-ui/typewriter-text'

export default function TypewriterTextDemo() {
  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--docs-mono)' }}>
        <TypewriterText
          text={['Build once.', 'Ship anywhere.', 'Zero config.']}
          loop
          speed={26}
          pauseDuration={1400}
        />
      </div>
    </div>
  )
}
