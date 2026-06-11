// shiny-text.tsx — Texto con un brillo que lo barre en loop.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// CSS puro: el texto se vuelve transparente y el gradiente (clipeado a los
// glifos con `background-clip: text`) se desplaza animando
// `background-position` — cero JS por frame. Con colores custom funciona
// también como texto con gradiente animado.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de
// tipo inline (`: string`, `: ReactNode`).

import { useEffect, type ReactNode } from 'react'

const COLOR = '#71717a' // color base del texto
const HIGHLIGHT = '#fafafa' // franja de brillo
const SPEED = 3 // segundos por barrido
const ANGLE = 120 // grados

const STYLE_ID = 'shiny-text-demo-styles'
const CSS = `
.shiny-demo {
  display: inline-block;
  background-image: linear-gradient(
    ${ANGLE}deg,
    ${COLOR} 0%,
    ${COLOR} 40%,
    ${HIGHLIGHT} 50%,
    ${COLOR} 60%,
    ${COLOR} 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shiny-sweep ${SPEED}s linear infinite;
}
@keyframes shiny-sweep {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .shiny-demo { animation: none; }
}
`

function ShinyText({ children }: { children?: ReactNode }) {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  return <span className="shiny-demo">{children}</span>
}

export default function ShinyTextDemo() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', background: '#050510' }}>
      <h1 style={{ fontSize: '3rem', margin: 0 }}>
        <ShinyText>Texto que brilla solo</ShinyText>
      </h1>
    </div>
  )
}
