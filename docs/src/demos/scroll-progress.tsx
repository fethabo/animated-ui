import { ScrollProgress } from '@fethabo/animated-ui/scroll-progress'
import type { DemoControl } from '../content'

// Barra real fija al viewport: refleja el scroll de esta página de docs.
export default function ScrollProgressDemo(props: Record<string, unknown>) {
  return (
    <div className="docs-demo-stage">
      <ScrollProgress position="top" color="#7c3aed" height={4} {...props} />
      <p style={{ margin: 0, opacity: 0.75, textAlign: 'center', maxWidth: 360 }}>
        Mirá el borde superior de la ventana y scrolleá esta página: la barra
        refleja el progreso.
      </p>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'position', type: 'enum', options: ['top', 'bottom'], default: 'top' },
  { prop: 'height', type: 'number', min: 2, max: 16, step: 1, default: 4 },
  { prop: 'zIndex', type: 'number', min: 1, max: 100, step: 1, default: 50 },
  { prop: 'color', type: 'color', default: '#7c3aed' },
  { prop: 'trackColor', type: 'color', default: '#12121f' },
]

