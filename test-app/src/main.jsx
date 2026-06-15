// Verificación visual: cada componente del paquete buildeado, con un panel de
// controles que varía sus props en runtime. Ver openspec/specs/test-app-harness.
import { createRoot } from 'react-dom/client'
import { ControlPanel } from './harness/ControlPanel.jsx'
import { demos } from './demos/index.js'

function Section({ title, children, height = '60vh', id }) {
  return (
    <section
      id={id}
      style={{
        position: 'relative',
        minHeight: height,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        borderBottom: '1px solid #222',
      }}
    >
      {children}
      {/* Título como overlay superior: no intercepta el mouse ni se superpone
          con el contenido centrado de un demo (e.g. la tarjeta de TeslaCoil). */}
      <h2
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          margin: 0,
          zIndex: 20,
          pointerEvents: 'none',
          maxWidth: '90%',
          textAlign: 'center',
          fontSize: '1.05rem',
          padding: '4px 14px',
          borderRadius: 8,
          background: 'rgba(10,10,18,0.6)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {title}
      </h2>
    </section>
  )
}

// Cada demo se monta envuelto en su ControlPanel; el panel bindea los valores
// a las props del componente vía render prop.
function DemoBlock({ demo }) {
  const panel = <ControlPanel controls={demo.controls}>{demo.render}</ControlPanel>

  // `bare`: el componente maneja su propia altura de scroll (e.g. StickyScenes),
  // así que no va dentro de una Section. Ancla su panel con un wrapper relativo.
  if (demo.bare) {
    return <div style={{ position: 'relative' }}>{panel}</div>
  }

  return (
    <Section id={demo.id} title={demo.title} height={demo.height}>
      {panel}
    </Section>
  )
}

function App() {
  return (
    <main>
      {demos.map((demo) => (
        <DemoBlock key={demo.id ?? demo.title} demo={demo} />
      ))}
      <Section title="Fin de la demo" height="40vh">
        <p style={{ opacity: 0.6 }}>Eso es todo.</p>
      </Section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)

// Los anchors existen recién después del render: re-aplica el hash para que
// los deep links (#particle-field, #scroll-reveal, ...) funcionen.
if (location.hash) {
  setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 150)
}
