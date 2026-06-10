// beam-section.tsx — Sección con rayos de luz rotando (variante beam),
// mostrando customización de colores y velocidad via CSS custom properties.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de
// tipo inline (`: string`).

import { useEffect } from 'react'

const BEAM_CSS = `
.aui-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-beam {
  background-color: var(--aui-beam-base, #050510);
}
.aui-beam::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    var(--aui-beam-color-1, rgba(124, 58, 237, 0.45)) 25deg,
    transparent 55deg,
    transparent 110deg,
    var(--aui-beam-color-2, rgba(14, 165, 233, 0.35)) 140deg,
    transparent 175deg,
    transparent 240deg,
    var(--aui-beam-color-3, rgba(236, 72, 153, 0.3)) 270deg,
    transparent 305deg,
    transparent 360deg
  );
  filter: blur(var(--aui-beam-blur, 24px));
  animation: aui-beam-spin var(--aui-beam-speed, 16s) linear infinite;
}
@keyframes aui-beam-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .aui-beam::before { animation: none; }
}
`

function injectStyles(id: string, css: string) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const style = document.createElement('style')
  style.id = id
  style.textContent = css
  document.head.appendChild(style)
}

function BeamBackground() {
  useEffect(() => {
    injectStyles('aui-beam-example-styles', BEAM_CSS)
  }, [])
  return (
    <div
      className="aui-bg aui-beam"
      aria-hidden="true"
      // Customización: colores ámbar/dorados y rotación más rápida que el
      // default. Estas mismas vars se pueden setear desde un stylesheet:
      //   .mi-seccion .aui-beam { --aui-beam-speed: 8s; }
      style={{
        '--aui-beam-base': '#0c0800',
        '--aui-beam-color-1': 'rgba(251, 191, 36, 0.4)',
        '--aui-beam-color-2': 'rgba(249, 115, 22, 0.3)',
        '--aui-beam-color-3': 'rgba(254, 240, 138, 0.25)',
        '--aui-beam-speed': '9s',
      }}
    />
  )
}

export default function BeamSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <BeamBackground />
      <div style={{ position: 'relative', textAlign: 'center', color: '#fef3c7' }}>
        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Luz en movimiento</h2>
        <p style={{ opacity: 0.75, maxWidth: 480, margin: '1rem auto 0' }}>
          La variante beam con paleta ámbar y velocidad personalizada — cuatro CSS custom
          properties y nada más.
        </p>
      </div>
    </section>
  )
}
