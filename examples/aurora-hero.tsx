// aurora-hero.tsx — Hero section con background aurora animado.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de
// tipo inline (`: string`).
//
// Customización via CSS custom properties (en tu CSS o inline):
//   --aui-aurora-color-1..4  colores de los gradientes
//   --aui-aurora-speed       duración del ciclo (default 14s)
//   --aui-aurora-blur        desenfoque (default 60px)

import { useEffect } from 'react'

const AURORA_CSS = `
.aui-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-aurora {
  background-image:
    radial-gradient(ellipse 80% 60% at 20% 30%, var(--aui-aurora-color-1, #5b21b6) 0%, transparent 60%),
    radial-gradient(ellipse 70% 60% at 80% 20%, var(--aui-aurora-color-2, #0ea5e9) 0%, transparent 60%),
    radial-gradient(ellipse 90% 70% at 60% 80%, var(--aui-aurora-color-3, #10b981) 0%, transparent 65%),
    radial-gradient(ellipse 60% 50% at 30% 70%, var(--aui-aurora-color-4, #ec4899) 0%, transparent 60%);
  background-size: 200% 200%;
  filter: blur(var(--aui-aurora-blur, 60px)) saturate(1.3);
  transform: scale(1.25);
  animation: aui-aurora-drift var(--aui-aurora-speed, 14s) ease-in-out infinite alternate;
}
@keyframes aui-aurora-drift {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 20% 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .aui-aurora { animation: none; }
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

function AuroraBackground() {
  useEffect(() => {
    injectStyles('aui-aurora-example-styles', AURORA_CSS)
  }, [])
  return <div className="aui-bg aui-aurora" aria-hidden="true" />
}

export default function AuroraHero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020208',
        overflow: 'hidden',
      }}
    >
      <AuroraBackground />
      <div style={{ position: 'relative', textAlign: 'center', padding: '2rem', color: 'white' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
          Construí interfaces vivas
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: 540, margin: '1rem auto 2rem' }}>
          Componentes animados livianos, sin dependencias, con control total sobre cada detalle
          visual.
        </p>
        <button
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: 600,
            color: '#020208',
            background: 'white',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
          }}
        >
          Empezar ahora
        </button>
      </div>
    </section>
  )
}
