// Verificación visual: todos los componentes funcionando desde el paquete buildeado.
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import {
  AnimatedBackground,
  GlowBorder,
  ImageDissolve,
  MagneticElement,
  MouseParallax,
  ParallaxLayers,
  ParticleField,
  PixelBackground,
  ScrambleText,
  ScrollProgress,
  ScrollReveal,
  ShinyText,
  SpotlightCard,
  StickyScenes,
  TiltCard,
} from '@fethabo/animated-ui'

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
      <h2 style={{ position: 'relative', margin: 0 }}>{title}</h2>
    </section>
  )
}

function App() {
  return (
    <main>
      {/* Barra global de progreso de lectura (v0.5). */}
      <ScrollProgress color="#22d3ee" height={4} />
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

      <Section title="SpotlightCard — defaults vs custom" height="50vh">
        <div style={{ display: 'flex', gap: '2rem', position: 'relative' }}>
          <SpotlightCard
            style={{
              width: 280,
              padding: '3rem 2rem',
              borderRadius: 16,
              background: '#12121f',
              border: '1px solid #333',
            }}
          >
            <strong>Spotlight default</strong>
            <p style={{ opacity: 0.7 }}>
              Mové el mouse: la luz te sigue. <a href="#spotlight">El contenido sigue clickeable.</a>
            </p>
          </SpotlightCard>
          <SpotlightCard
            color="rgba(34, 211, 238, 0.2)"
            radius={350}
            style={{
              width: 280,
              padding: '3rem 2rem',
              borderRadius: 16,
              background: '#0f1a1f',
              border: '1px solid #333',
            }}
          >
            <strong>Spotlight cyan, radio 350</strong>
            <p style={{ opacity: 0.7 }}>Color y radio via props.</p>
          </SpotlightCard>
        </div>
      </Section>

      <Section title="GlowBorder — loop y followCursor" height="50vh">
        <div style={{ display: 'flex', gap: '2rem', position: 'relative' }}>
          <GlowBorder
            width={2}
            radius={16}
            contentStyle={{ background: '#12121f', padding: '3rem 2rem', width: 280 }}
          >
            <strong>GlowBorder loop</strong>
            <p style={{ opacity: 0.7 }}>Rotación autónoma (se detiene con reduced motion).</p>
          </GlowBorder>
          <GlowBorder
            followCursor
            width={2}
            radius={16}
            colors={['#fbbf24', '#f97316']}
            contentStyle={{ background: '#1a1410', padding: '3rem 2rem', width: 280 }}
          >
            <strong>GlowBorder followCursor</strong>
            <p style={{ opacity: 0.7 }}>El brillo apunta hacia tu cursor.</p>
          </GlowBorder>
        </div>
      </Section>

      <Section title="MagneticElement — botón + render prop" height="50vh">
        <div style={{ display: 'flex', gap: '3rem', position: 'relative', alignItems: 'center' }}>
          <MagneticElement>
            <button
              style={{
                padding: '1rem 2.5rem',
                borderRadius: 999,
                border: '1px solid #555',
                background: '#7c3aed',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Atrapame
            </button>
          </MagneticElement>
          <MagneticElement strength={0.6} hitArea={60}>
            {({ offsetX, offsetY, isActive }) => (
              <div
                style={{
                  padding: '1.5rem 2rem',
                  borderRadius: 12,
                  background: '#12121f',
                  border: `1px solid ${isActive ? '#7c3aed' : '#333'}`,
                  textAlign: 'center',
                }}
              >
                <strong>Render prop</strong>
                <p style={{ opacity: 0.7, margin: 0 }}>
                  x: {offsetX.toFixed(0)} · y: {offsetY.toFixed(0)} · {isActive ? 'activo' : 'reposo'}
                </p>
              </div>
            )}
          </MagneticElement>
        </div>
      </Section>

      <Section title="ShinyText — defaults, gradiente custom y override por cascada" height="50vh">
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>
          <ShinyText>Brillo con defaults</ShinyText>
        </h1>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>
          <ShinyText color="#155e75" highlight="#22d3ee" speed={2} angle={90}>
            Gradiente cyan (caso GradientText)
          </ShinyText>
        </h1>
        {/* La var en el padre pisa el default por cascada (sin props). */}
        <div style={{ '--aui-shiny-speed': '8s', fontSize: '1.5rem' }}>
          <ShinyText>Barrido lento via --aui-shiny-speed en el padre</ShinyText>
        </div>
      </Section>

      <Section id="parallax" title="MouseParallax — capas con profundidades opuestas" height="70vh">
        <MouseParallax style={{ width: '100%', minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
          <MouseParallax.Layer depth={40}>
            <div style={{ fontSize: '4rem', opacity: 0.25, letterSpacing: '2rem' }}>✦ ✦ ✦</div>
          </MouseParallax.Layer>
          <MouseParallax.Layer depth={-15} style={{ position: 'absolute' }}>
            <div
              style={{
                padding: '2rem 3rem',
                borderRadius: 16,
                background: '#12121f',
                border: '1px solid #333',
                textAlign: 'center',
              }}
            >
              <strong>MouseParallax</strong>
              <p style={{ opacity: 0.7, margin: 0 }}>El fondo sigue al mouse; este card se opone.</p>
            </div>
          </MouseParallax.Layer>
        </MouseParallax>
      </Section>

      <Section id="parallax-scroll" title="ParallaxLayers — capas ligadas al scroll (mirá los bordes al scrollear)" height="90vh">
        <ParallaxLayers
          style={{ width: '100%', minHeight: '70vh', overflow: 'hidden', display: 'grid', placeItems: 'center' }}
        >
          <ParallaxLayers.Layer depth={80}>
            {/* Fondo sobredimensionado para no dejar huecos al desplazarse. */}
            <div style={{ margin: '-15% 0', fontSize: '5rem', opacity: 0.2, textAlign: 'center', letterSpacing: '1.5rem' }}>
              ✦ ✦ ✦<br />✦ ✦ ✦<br />✦ ✦ ✦
            </div>
          </ParallaxLayers.Layer>
          <ParallaxLayers.Layer depth={-30} style={{ position: 'absolute' }}>
            <div
              style={{
                padding: '2rem 3rem',
                borderRadius: 16,
                background: '#12121f',
                border: '1px solid #333',
                textAlign: 'center',
              }}
            >
              <strong>ParallaxLayers</strong>
              <p style={{ opacity: 0.7, margin: 0 }}>El fondo acompaña al scroll; este card va en contra.</p>
            </div>
          </ParallaxLayers.Layer>
        </ParallaxLayers>
      </Section>

      <Section id="reveal" title="ScrollReveal — stagger al entrar al viewport (scrolleá hasta acá)" height="80vh">
        <ScrollReveal
          stagger={0.2}
          distance={32}
          style={{ display: 'flex', gap: '2rem', position: 'relative' }}
        >
          {['Uno', 'Dos', 'Tres'].map((label) => (
            <div
              key={label}
              style={{
                width: 200,
                padding: '2.5rem 1.5rem',
                borderRadius: 16,
                background: '#12121f',
                border: '1px solid #333',
                textAlign: 'center',
              }}
            >
              <strong>{label}</strong>
              <p style={{ opacity: 0.7, margin: 0 }}>Entra en cascada.</p>
            </div>
          ))}
        </ScrollReveal>
        {/* override por cascada: este segundo reveal hereda --aui-reveal-duration del wrapper */}
        <div style={{ '--aui-reveal-duration': '1.5s', position: 'relative' }}>
          <ScrollReveal direction="left">
            <p style={{ opacity: 0.7 }}>Este entra desde la derecha, lento via var en cascada.</p>
          </ScrollReveal>
        </div>
      </Section>

      <Section title="ScrambleText — mount, hover y scrambleColor" height="50vh">
        <h1 style={{ fontFamily: 'monospace', fontSize: '2rem', margin: 0, color: '#4ade80' }}>
          <ScrambleText text="Acceso concedido: bienvenido" />
        </h1>
        <p style={{ fontFamily: 'monospace', fontSize: '1.25rem', margin: 0 }}>
          <ScrambleText
            text="Pasá el mouse para re-descifrar"
            trigger="both"
            scrambleColor="#f472b6"
          />
        </p>
      </Section>

      <Section id="particle-field" title="ParticleField — repulsión al cursor (mové el mouse)" height="80vh">
        {/* El canvas llena el contenedor: la Section es position:relative. */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <ParticleField count={90} color="#22d3ee" cursorInteraction="repel" />
        </div>
        <p style={{ position: 'relative', opacity: 0.7 }}>Las partículas huyen del cursor.</p>
      </Section>

      <Section id="image-dissolve" title="ImageDissolve — transición Bayer (clic en los números)" height="80vh">
        <ImageDissolveDemo />
      </Section>

      <StickyScenesDemo />

      <Section title="Fin de la demo" height="40vh">
        <p style={{ opacity: 0.6 }}>Eso es todo.</p>
      </Section>
    </main>
  )
}

// Genera una imagen same-origin (data URL PNG) con un gradiente y un número.
// Los data URLs PNG NO "taintean" el canvas, así que getImageData funciona y
// la transición dithered se ve de verdad (sin depender de archivos externos).
function makeImage(label, from, to) {
  const c = document.createElement('canvas')
  c.width = 480
  c.height = 320
  const ctx = c.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, 480, 320)
  grad.addColorStop(0, from)
  grad.addColorStop(1, to)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 480, 320)
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 160px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, 240, 170)
  return c.toDataURL('image/png')
}

function ImageDissolveDemo() {
  const [index, setIndex] = useState(0)
  const [images] = useState(() => [
    makeImage('1', '#7c3aed', '#22d3ee'),
    makeImage('2', '#f59e0b', '#ef4444'),
    makeImage('3', '#10b981', '#3b82f6'),
  ])
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: 480, maxWidth: '90vw' }}>
        <ImageDissolve src={images[index]} alt={`Imagen ${index + 1}`} duration={1000} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: '1px solid #444',
              background: i === index ? '#7c3aed' : '#12121f',
              color: '#eee',
              cursor: 'pointer',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

function StickyScenesDemo() {
  return (
    <StickyScenes sceneDuration={700}>
      <StickyScenes.Scene className="ss-demo-scene">
        <h1 style={{ fontSize: '4rem', margin: 0 }}>Escena uno</h1>
      </StickyScenes.Scene>
      <StickyScenes.Scene className="ss-demo-scene">
        {/* Interpola con --aui-scene-progress via calc() puro. */}
        <h1
          style={{
            fontSize: '4rem',
            margin: 0,
            transform: 'translateY(calc((1 - var(--aui-scene-progress, 0)) * 60px))',
            color: 'hsl(calc(var(--aui-scene-progress, 0) * 280), 80%, 70%)',
          }}
        >
          Escena dos (interpolada)
        </h1>
      </StickyScenes.Scene>
      <StickyScenes.Scene className="ss-demo-scene">
        <h1 style={{ fontSize: '4rem', margin: 0 }}>Escena tres</h1>
      </StickyScenes.Scene>
    </StickyScenes>
  )
}

createRoot(document.getElementById('root')).render(<App />)

// Los anchors existen recién después del render: re-aplica el hash para
// que los deep links (#parallax, #reveal, ...) funcionen.
if (location.hash) {
  setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 150)
}
