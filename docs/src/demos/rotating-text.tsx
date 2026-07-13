import { RotatingText } from '@fethabo/animated-ui/rotating-text'

export default function RotatingTextDemo() {
  return (
    <div className="docs-demo-stage">
      <div style={{ fontSize: '2.2rem', fontWeight: 700 }}>
        We build{' '}
        <RotatingText
          words={['faster', 'lighter', 'smoother', 'zero-config']}
          transition="slide-up"
          color="#a78bfa"
        />
      </div>
    </div>
  )
}
