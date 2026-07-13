import { ScrollProgress } from '@fethabo/animated-ui/scroll-progress'

// Barra real fija al viewport: refleja el scroll de esta página de docs.
export default function ScrollProgressDemo() {
  return (
    <div className="docs-demo-stage">
      <ScrollProgress position="top" color="#7c3aed" height={4} />
      <p style={{ margin: 0, opacity: 0.75, textAlign: 'center', maxWidth: 360 }}>
        Mirá el borde superior de la ventana y scrolleá esta página: la barra
        refleja el progreso.
      </p>
    </div>
  )
}
