import { HorizontalScrollSection } from '@fethabo/animated-ui'

const PANELS = [
  { label: 'Uno', bg: '#1e1b4b' },
  { label: 'Dos', bg: '#0c4a6e' },
  { label: 'Tres', bg: '#14532d' },
  { label: 'Cuatro', bg: '#7c2d12' },
]

export default {
  id: 'horizontal-scroll-section',
  title: 'HorizontalScrollSection — scrolleá verticalmente para recorrer los paneles',
  // La sección define su propia altura de recorrido: va fuera de una Section.
  bare: true,
  controls: [
    { prop: 'speed', type: 'number', min: 0.25, max: 3, step: 0.25, default: 1 },
  ],
  render: (props) => (
    <HorizontalScrollSection {...props}>
      {PANELS.map((panel) => (
        <section
          key={panel.label}
          style={{
            width: '100vw',
            height: '100dvh',
            display: 'grid',
            placeItems: 'center',
            background: panel.bg,
            color: '#fff',
            fontSize: '2rem',
          }}
        >
          {panel.label} — progreso: <span style={{ opacity: 0.6, fontSize: '1rem' }}>var(--aui-hscroll-progress)</span>
        </section>
      ))}
    </HorizontalScrollSection>
  ),
}
