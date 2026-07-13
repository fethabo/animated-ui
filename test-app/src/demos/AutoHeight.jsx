import { useState } from 'react'
import { AutoHeight } from '@fethabo/animated-ui'

// Contenido intercambiable de alturas (y anchos) bien distintas; el bloque de
// abajo evidencia que el layout circundante se desplaza suave y que, al
// terminar, el contenedor vuelve a height: auto (probá redimensionar la
// ventana después de animar).
const PANELS = [
  { label: 'Corto', text: 'Un resumen de una línea.' },
  {
    label: 'Medio',
    text: 'Un panel intermedio con un par de líneas de contenido, suficiente para que la diferencia de altura se note al transicionar.',
  },
  {
    label: 'Largo',
    text: 'Un panel bastante más alto: varias líneas que fuerzan al contenedor a crecer. La transición hace que el contenido inferior se desplace suavemente en lugar de saltar. Al terminar, la altura vuelve a auto: si el viewport cambia de ancho y el texto re-wrappea, el contenedor sigue el flujo normal del layout sin ninguna altura fija residual. Interrumpí el cambio de panel a mitad de la transición para verificar el encadenado sin saltos.',
  },
]

const buttonStyle = (active) => ({
  padding: '0.4rem 0.9rem',
  borderRadius: 8,
  border: `1px solid ${active ? '#7c3aed' : '#333'}`,
  background: active ? '#7c3aed' : '#1e1b2e',
  color: '#e5e5e5',
  cursor: 'pointer',
})

function Demo(props) {
  const [panel, setPanel] = useState(0)
  return (
    <div style={{ width: 'min(520px, 90%)' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {PANELS.map((p, i) => (
          <button key={p.label} style={buttonStyle(i === panel)} onClick={() => setPanel(i)}>
            {p.label}
          </button>
        ))}
      </div>
      <AutoHeight
        {...props}
        style={{
          borderRadius: 12,
          background: '#1e1b2e',
          border: '1px solid #333',
          color: '#e5e5e5',
          width: props.width ? 'max-content' : undefined,
          maxWidth: '100%',
        }}
      >
        <p style={{ margin: 0, padding: '1rem', maxWidth: 480 }}>{PANELS[panel].text}</p>
      </AutoHeight>
      <p style={{ opacity: 0.6, marginTop: 12 }}>
        Este bloque se desplaza suavemente cuando el panel de arriba cambia de altura.
      </p>
    </div>
  )
}

export default {
  id: 'auto-height',
  title: 'AutoHeight — transición de height: auto (intercambiá los paneles)',
  height: '70vh',
  controls: [
    { prop: 'duration', type: 'number', min: 0.1, max: 1.5, step: 0.05, default: 0.3 },
    {
      prop: 'easing',
      type: 'enum',
      options: ['ease', 'ease-out', 'ease-in-out', 'cubic-bezier(0.22, 1, 0.36, 1)'],
      default: 'ease',
    },
    { prop: 'width', type: 'boolean', default: false },
  ],
  render: (props) => <Demo {...props} />,
}
