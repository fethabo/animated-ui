// rotating-text.tsx — Palabra que rota cíclicamente con transición y layout
// estable: "Hacemos webs / apps / magia".
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El avance usa un setTimeout encadenado (sin RAF); la palabra nueva entra
// con una animación CSS (key por índice re-monta el nodo) y el ancho del box
// transiciona hacia el ancho medido de la palabra nueva (medición por ref al
// cambiar, no por frame) — el texto circundante no salta. Accesible sin
// aria-live: aria-label estático con la lista completa, palabra animada
// aria-hidden. Con prefers-reduced-motion queda la primera palabra fija.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef, useState } from 'react'

const WORDS = ['webs', 'apps', 'magia']
const INTERVAL = 2200 // ms visibles por palabra
const DURATION = 0.4 // s de la transición

const CSS = `
.rotating-box {
  display: inline-block;
  position: relative;
  vertical-align: bottom;
  white-space: nowrap;
  overflow: hidden;
  color: #a78bfa;
  transition: width ${DURATION}s ease;
}
.rotating-word {
  display: inline-block;
  animation: rotating-in ${DURATION}s ease;
}
.rotating-measurer {
  position: absolute;
  left: 0;
  top: 0;
  visibility: hidden;
  white-space: nowrap;
}
@keyframes rotating-in {
  from { opacity: 0; transform: translateY(0.9em); }
}
@media (prefers-reduced-motion: reduce) {
  .rotating-word { animation: none; }
}
`

export default function RotatingTextDemo() {
  const boxRef = useRef<HTMLSpanElement>(null)
  const measurerRef = useRef<HTMLSpanElement>(null)
  const [index, setIndex] = useState(0)
  const word = WORDS[index]

  useEffect(() => {
    if (document.getElementById('rotating-demo-css')) return
    const style = document.createElement('style')
    style.id = 'rotating-demo-css'
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  // Avance encadenado; con reduced motion no se programa (palabra fija).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % WORDS.length), INTERVAL)
    return () => clearTimeout(id)
  }, [index])

  // Layout estable: el box transiciona hacia el ancho medido de la palabra.
  useEffect(() => {
    if (boxRef.current && measurerRef.current) {
      boxRef.current.style.width = `${measurerRef.current.offsetWidth}px`
    }
  }, [word])

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '50vh', background: '#0a0a12' }}>
      <h1 style={{ color: '#e5e5e5', fontFamily: 'system-ui' }} aria-label={`Hacemos ${WORDS.join(', ')}`}>
        Hacemos{' '}
        <span ref={boxRef} className="rotating-box" aria-hidden="true">
          <span key={index} className="rotating-word">
            {word}
          </span>
          <span ref={measurerRef} className="rotating-measurer">
            {word}
          </span>
        </span>
      </h1>
    </div>
  )
}
