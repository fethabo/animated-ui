import { useState } from 'react'
import { AutoHeight } from '@fethabo/animated-ui/auto-height'
import type { DemoControl } from '../content'

const PANELS = [
  'Un resumen de una línea.',
  'Un panel intermedio con un par de líneas de contenido, suficiente para que la diferencia de altura se note al transicionar.',
  'Un panel bastante más alto: varias líneas que fuerzan al contenedor a crecer. La transición hace que el contenido inferior se desplace suavemente en lugar de saltar. Al terminar, la altura vuelve a auto.',
]
const btn = (active: boolean) => ({ padding: '0.4rem 0.9rem', borderRadius: 8, border: `1px solid ${active ? '#7c3aed' : '#2c2c4a'}`, background: active ? '#7c3aed' : '#1e1b2e', color: '#e8e8f0', cursor: 'pointer', font: 'inherit' })

export default function AutoHeightDemo(props: Record<string, unknown>) {
  const [panel, setPanel] = useState(0)
  return (
    <div className="docs-demo-stage" style={{ width: '100%' }}>
      <div style={{ width: 'min(460px, 90%)' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
        {['Corto', 'Medio', 'Largo'].map((label, i) => (
          <button key={label} style={btn(i === panel)} onClick={() => setPanel(i)}>
            {label}
          </button>
        ))}
      </div>
      <AutoHeight {...props} style={{ borderRadius: 12, background: '#1e1b2e', border: '1px solid #2c2c4a' }}>
        <p style={{ margin: 0, padding: '1rem' }}>{PANELS[panel]}</p>
      </AutoHeight>
      </div>
    </div>
  )
}

export const controls: DemoControl[] = [
  { prop: 'duration', type: 'number', min: 0.1, max: 1.5, step: 0.05, default: 0.3 },
  {
    prop: 'easing',
    type: 'enum',
    options: ['ease', 'ease-out', 'ease-in-out', 'linear', 'cubic-bezier(0.22, 1, 0.36, 1)'],
    default: 'ease',
  },
  { prop: 'width', type: 'boolean', default: false },
]
