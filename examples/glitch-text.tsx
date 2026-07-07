// glitch-text.tsx — Titular con glitch RGB-split intermitente, CSS puro.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Las dos capas desplazadas (roja/cyan) son ::before/::after con
// `content: attr(data-text)` — no existen en el árbol de accesibilidad, así
// el texto se lee una sola vez. El glitch es intermitente: una ráfaga breve
// por ciclo de 3s, con clip-path cambiando durante la ráfaga y capas
// invisibles el resto del tiempo. Sin JS por frame. Pensado para titulares
// (el clip-path animado sobre párrafos cuesta pintado). Con
// prefers-reduced-motion queda estático.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect } from 'react'

const CSS = `
.glitch {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  font-family: monospace;
  font-size: 3rem;
  color: #e5e5e5;
}
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
}
.glitch::before {
  color: #ff004d;
  animation: glitch-a 3s linear infinite;
}
.glitch::after {
  color: #00fff9;
  animation: glitch-b 3s linear infinite;
}
/* Ráfaga del 8% al 24% del ciclo; estable el resto. */
@keyframes glitch-a {
  0%, 8%, 24%, 100% { opacity: 0; transform: none; clip-path: inset(50% 0 50% 0); }
  8.01% { opacity: 1; transform: translateX(-3px); clip-path: inset(10% 0 55% 0); }
  16% { opacity: 1; transform: translateX(-3px); clip-path: inset(65% 0 10% 0); }
}
@keyframes glitch-b {
  0%, 8%, 24%, 100% { opacity: 0; transform: none; clip-path: inset(50% 0 50% 0); }
  8.01% { opacity: 1; transform: translateX(3px); clip-path: inset(30% 0 40% 0); }
  16% { opacity: 1; transform: translateX(3px); clip-path: inset(80% 0 4% 0); }
}
@media (prefers-reduced-motion: reduce) {
  .glitch::before, .glitch::after { animation: none; }
}
`

export default function GlitchTextDemo() {
  useEffect(() => {
    if (document.getElementById('glitch-demo-css')) return
    const style = document.createElement('style')
    style.id = 'glitch-demo-css'
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '50vh', background: '#0a0a12' }}>
      <h1 className="glitch" data-text="ERROR 404">
        ERROR 404
      </h1>
    </div>
  )
}
