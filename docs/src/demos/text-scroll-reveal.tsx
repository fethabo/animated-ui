import { TextScrollReveal } from '@fethabo/animated-ui/text-scroll-reveal'

// scroll-driven pero sin sticky: funciona dentro del frame al scrollear la página.
export default function TextScrollRevealDemo() {
  return (
    <div className="docs-demo-stage">
      <TextScrollReveal
        as="p"
        toColor="#e8e8f0"
        fromColor="#3a3a52"
        style={{ fontSize: '1.6rem', fontWeight: 600, maxWidth: 420, textAlign: 'center', margin: 0 }}
      >
        Cada palabra se enciende a medida que este bloque recorre el viewport.
      </TextScrollReveal>
    </div>
  )
}
