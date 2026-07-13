import { ShinyText } from '@fethabo/animated-ui/shiny-text'

export default function ShinyTextDemo() {
  return (
    <div className="docs-demo-stage">
      <h2 style={{ fontSize: '2.2rem', margin: 0 }}>
        <ShinyText color="#71717a" highlight="#fafafa" speed={3}>
          Shine on, you crazy text
        </ShinyText>
      </h2>
    </div>
  )
}
