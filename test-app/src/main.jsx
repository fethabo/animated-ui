// Verificación 9.1: los tres componentes funcionando desde el paquete buildeado.
import { createRoot } from 'react-dom/client'
import { AnimatedBackground, PixelBackground, TiltCard } from '@fethabo/animated-ui'

function Section({ title, children, height = '60vh' }) {
  return (
    <section
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
      <h2 style={{ position: 'relative', margin: 0 }}>{title}</h2>
    </section>
  )
}

function App() {
  return (
    <main>
      <Section title="AnimatedBackground — aurora (defaults)">
        <AnimatedBackground variant="aurora" />
      </Section>

      <Section title="AnimatedBackground — beam (colores y velocidad custom)">
        <AnimatedBackground
          variant="beam"
          colors={['rgba(251,191,36,0.4)', 'rgba(249,115,22,0.3)', 'rgba(254,240,138,0.25)']}
          speed={9}
        />
      </Section>

      <Section title="AnimatedBackground — mesh">
        <AnimatedBackground variant="mesh" intensity={0.8} />
      </Section>

      <Section title="AnimatedBackground — noise">
        <AnimatedBackground variant="noise" />
      </Section>

      <Section title="PixelBackground — hover + idle + reveal">
        <PixelBackground
          behaviors={['hover', 'idle', 'reveal']}
          color="#22d3ee"
          idleIntensity={0.25}
          hoverRadius={150}
        />
      </Section>

      <Section title="TiltCard — glare + render prop" height="50vh">
        <TiltCard glare maxAngle={12} style={{ position: 'relative' }}>
          {({ tiltX, tiltY, isHovering }) => (
            <div
              style={{
                width: 320,
                padding: '3rem 2rem',
                borderRadius: 16,
                background: '#12121f',
                border: '1px solid #333',
                textAlign: 'center',
              }}
            >
              <strong>TiltCard</strong>
              <p style={{ opacity: 0.7 }}>
                tiltX: {tiltX.toFixed(1)}° · tiltY: {tiltY.toFixed(1)}° ·{' '}
                {isHovering ? 'hover' : 'idle'}
              </p>
            </div>
          )}
        </TiltCard>
      </Section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
