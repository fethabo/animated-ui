import { HorizontalScrollSection } from '@fethabo/animated-ui/horizontal-scroll-section'

const PANELS = [['Uno', '#1e1b4b'], ['Dos', '#0c4a6e'], ['Tres', '#14532d'], ['Cuatro', '#7c2d12']]

export default function HorizontalScrollSectionDemo() {
  return (
    <HorizontalScrollSection speed={1}>
      {PANELS.map(([label, bg]) => (
        <section key={label} style={{ width: '100vw', height: '100dvh', display: 'grid', placeItems: 'center', background: bg, color: '#fff', fontSize: '2.4rem', fontWeight: 700 }}>
          {label}
        </section>
      ))}
    </HorizontalScrollSection>
  )
}

export const demoLayout = 'flow'
