// lava-section.tsx — Sección con la variante lava (lámpara de lava gooey).
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Varios blobs opacos (radial-gradients sobre un fondo opaco) ascienden y
// descienden con @keyframes de background-position a distinta fase; el
// contenedor aplica `filter: blur() contrast()` para fundir los bordes (el
// blur ablanda, el contrast endurece → metaballs gooey). CSS puro, sin JS por
// frame. El filter rinde mejor en contenedores acotados que a pantalla
// completa; con reduced motion degrada a una composición estática.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect } from 'react'

const LAVA_CSS = `
.aui-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-lava {
  background-color: var(--aui-lava-base, #160a2b);
  /* `circle closest-side` sobre tiles cuadrados → círculos reales (no elipses),
     que el blur + contrast funde en blobs gooey. */
  background-image:
    radial-gradient(circle closest-side, var(--aui-lava-color-1, #ff4d6d) 0 72%, transparent 100%),
    radial-gradient(circle closest-side, var(--aui-lava-color-2, #ff924d) 0 72%, transparent 100%),
    radial-gradient(circle closest-side, var(--aui-lava-color-1, #ff4d6d) 0 72%, transparent 100%),
    radial-gradient(circle closest-side, var(--aui-lava-color-2, #ff924d) 0 72%, transparent 100%),
    radial-gradient(circle closest-side, var(--aui-lava-color-1, #ff4d6d) 0 72%, transparent 100%);
  background-repeat: no-repeat;
  background-size: 280px 280px, 218px 218px, 314px 314px, 190px 190px, 252px 252px;
  background-position: 12% 115%, 31% 130%, 52% 120%, 71% 135%, 89% 125%;
  filter: blur(var(--aui-lava-blur, 16px)) contrast(var(--aui-lava-contrast, 16));
  animation: aui-lava-rise var(--aui-lava-speed, 16s) ease-in-out infinite alternate;
}
@keyframes aui-lava-rise {
  0%   { background-position: 12% 115%, 31% 130%, 52% 120%, 71% 135%, 89% 125%; }
  50%  { background-position: 12% 42%,  31% 30%,  52% 52%,  71% 28%,  89% 48%; }
  100% { background-position: 12% -20%, 31% -12%, 52% -25%, 71% -8%,  89% -18%; }
}
@media (prefers-reduced-motion: reduce) {
  .aui-lava {
    animation: none;
    background-position: 12% 35%, 31% 58%, 52% 42%, 71% 62%, 89% 48%;
  }
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

function LavaBackground() {
  useEffect(() => {
    injectStyles('aui-lava-example-styles', LAVA_CSS)
  }, [])
  return (
    <div
      className="aui-bg aui-lava"
      aria-hidden="true"
      // Customización: estas mismas vars se pueden setear desde un stylesheet:
      //   .mi-seccion .aui-lava { --aui-lava-speed: 10s; }
      style={{
        '--aui-lava-color-1': '#ff6b6b',
        '--aui-lava-color-2': '#f59e0b',
        '--aui-lava-speed': '14s',
      }}
    />
  )
}

export default function LavaSection() {
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
      <LavaBackground />
      <div style={{ position: 'relative', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Lámpara de lava</h2>
        <p style={{ opacity: 0.85, maxWidth: 480, margin: '1rem auto 0' }}>
          Blobs que ascienden y se funden con el truco gooey (blur + contrast) — CSS puro, sin
          canvas ni WebGL.
        </p>
      </div>
    </section>
  )
}
