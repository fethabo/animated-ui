import { HorizontalScrollSection } from '@fethabo/animated-ui/horizontal-scroll-section'
import type { DemoControl } from '../content'

const PANELS = [['Uno', '#1e1b4b'], ['Dos', '#0c4a6e'], ['Tres', '#14532d'], ['Cuatro', '#7c2d12']]

export default function HorizontalScrollSectionDemo(props: Record<string, unknown>) {
  return (
    <HorizontalScrollSection speed={1} {...props}>
      {PANELS.map(([label, bg]) => (
        <section key={label} style={{ width: '100vw', height: '100dvh', display: 'grid', placeItems: 'center', background: bg, color: '#fff', fontSize: '2.4rem', fontWeight: 700 }}>
          {label}
        </section>
      ))}
    </HorizontalScrollSection>
  )
}

// full-bleed: los paneles son 100vw, así que el demo rompe el ancho del
// artículo y ocupa el viewport (el inner del componente recorta con overflow).
export const demoLayout = 'full-bleed'

export const controls: DemoControl[] = [
  { prop: 'speed', type: 'number', min: 0.25, max: 3, step: 0.25, default: 1 },
]
