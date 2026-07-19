// bubbles-section.tsx — Sección con la variante bubbles (burbujas ascendiendo).
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Dos planos de parallax en ::before (burbujas chicas, más lento) y ::after
// (burbujas grandes): cada plano es un set de radial-gradients tileados con
// background-repeat, y el @keyframes traslada el pseudo-elemento exactamente
// la altura del tile en Y — el frame final es idéntico al inicial, loop sin
// salto. El sway horizontal vuelve a 0 al cierre del ciclo para no romper el
// wrap. La translucidez se deriva con color-mix() de colores sólidos. CSS
// puro, sin JS por frame; con reduced motion degrada a burbujas estáticas.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect } from 'react'

const BUBBLES_CSS = `
.aui-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-bubbles {
  background-color: var(--aui-bubbles-base, #0b1e33);
  opacity: var(--aui-bubbles-opacity, 1);
}
.aui-bubbles::before,
.aui-bubbles::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background-repeat: repeat;
}
/* Plano lejano: burbujas chicas, ascenso más lento. Tile de alto size*8. */
.aui-bubbles::before {
  bottom: calc(var(--aui-bubbles-size, 56px) * -8);
  background-image:
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.2) at 32% 24%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 10%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 42%, transparent) 88% 94%,
      transparent 97%),
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.14) at 78% 55%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 10%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 38%, transparent) 88% 94%,
      transparent 97%),
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.26) at 14% 78%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 8%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 36%, transparent) 88% 94%,
      transparent 97%);
  background-size:
    calc(var(--aui-bubbles-size, 56px) * 4.6) calc(var(--aui-bubbles-size, 56px) * 8),
    calc(var(--aui-bubbles-size, 56px) * 3.8) calc(var(--aui-bubbles-size, 56px) * 8),
    calc(var(--aui-bubbles-size, 56px) * 5.6) calc(var(--aui-bubbles-size, 56px) * 8);
  background-position:
    0 0,
    calc(var(--aui-bubbles-size, 56px) * 1) calc(var(--aui-bubbles-size, 56px) * 3),
    calc(var(--aui-bubbles-size, 56px) * 2.4) calc(var(--aui-bubbles-size, 56px) * 5.6);
  animation: aui-bubbles-rise-far calc(var(--aui-bubbles-speed, 24s) * 1.7) linear infinite;
}
/* Plano cercano: burbujas grandes, a la velocidad base. Tile de alto size*6. */
.aui-bubbles::after {
  bottom: calc(var(--aui-bubbles-size, 56px) * -6);
  background-image:
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.5) at 24% 18%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 10%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 45%, transparent) 88% 94%,
      transparent 97%),
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.34) at 72% 62%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 10%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-2, #a5b4fc) 42%, transparent) 88% 94%,
      transparent 97%),
    radial-gradient(circle calc(var(--aui-bubbles-size, 56px) * 0.42) at 50% 86%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 9%, transparent) 0 62%,
      color-mix(in srgb, var(--aui-bubbles-color-1, #7dd3fc) 40%, transparent) 88% 94%,
      transparent 97%);
  background-size:
    calc(var(--aui-bubbles-size, 56px) * 7) calc(var(--aui-bubbles-size, 56px) * 6),
    calc(var(--aui-bubbles-size, 56px) * 5.4) calc(var(--aui-bubbles-size, 56px) * 6),
    calc(var(--aui-bubbles-size, 56px) * 6.2) calc(var(--aui-bubbles-size, 56px) * 6);
  background-position:
    0 0,
    calc(var(--aui-bubbles-size, 56px) * 1.5) calc(var(--aui-bubbles-size, 56px) * 2),
    calc(var(--aui-bubbles-size, 56px) * 3) calc(var(--aui-bubbles-size, 56px) * 4);
  animation: aui-bubbles-rise-near var(--aui-bubbles-speed, 24s) linear infinite;
}
/* El recorrido en Y es exactamente la altura de tile del plano: wrap sin salto. */
@keyframes aui-bubbles-rise-near {
  0%   { transform: translate3d(0, 0, 0); }
  50%  { transform: translate3d(calc(var(--aui-bubbles-size, 56px) * 0.12), calc(var(--aui-bubbles-size, 56px) * -3), 0); }
  100% { transform: translate3d(0, calc(var(--aui-bubbles-size, 56px) * -6), 0); }
}
@keyframes aui-bubbles-rise-far {
  0%   { transform: translate3d(0, 0, 0); }
  50%  { transform: translate3d(calc(var(--aui-bubbles-size, 56px) * -0.1), calc(var(--aui-bubbles-size, 56px) * -4), 0); }
  100% { transform: translate3d(0, calc(var(--aui-bubbles-size, 56px) * -8), 0); }
}
@media (prefers-reduced-motion: reduce) {
  .aui-bubbles::before,
  .aui-bubbles::after {
    animation: none;
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

function BubblesBackground() {
  useEffect(() => {
    injectStyles('aui-bubbles-example-styles', BUBBLES_CSS)
  }, [])
  return (
    <div
      className="aui-bg aui-bubbles"
      aria-hidden="true"
      // Customización: estas mismas vars se pueden setear desde un stylesheet:
      //   .mi-seccion .aui-bubbles { --aui-bubbles-speed: 30s; }
      style={{
        '--aui-bubbles-color-1': '#38bdf8',
        '--aui-bubbles-color-2': '#c4b5fd',
        '--aui-bubbles-speed': '24s',
      }}
    />
  )
}

export default function BubblesSection() {
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
      <BubblesBackground />
      <div style={{ position: 'relative', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Burbujas</h2>
        <p style={{ opacity: 0.85, maxWidth: 480, margin: '1rem auto 0' }}>
          Burbujas translúcidas que ascienden lentamente en dos planos de parallax — CSS puro, sin
          canvas ni WebGL.
        </p>
      </div>
    </section>
  )
}
