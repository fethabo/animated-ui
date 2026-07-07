// wavy-text.tsx — Caracteres ondulando en loop continuo (ola que recorre el
// texto), CSS puro.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Cada carácter es un span inline-block con la misma animación de translateY
// (solo transform: compositado, no altera la métrica de línea) y un
// animation-delay negativo proporcional a su índice — la ola ya está en curso
// al montar y recorre el texto de izquierda a derecha. El texto completo va
// en aria-label y los chars son aria-hidden; los espacios se preservan con
// white-space: pre. Con prefers-reduced-motion queda estático.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect } from 'react'

const TEXT = '¡Olas en el texto!'
const AMPLITUDE = 8 // px
const SPEED = 1.4 // s por ciclo
const STAGGER = 0.06 // s entre caracteres

const CSS = `
.wavy-char {
  display: inline-block;
  animation: wavy-bob ${SPEED}s ease-in-out infinite;
  will-change: transform;
}
.wavy-space {
  white-space: pre;
}
@keyframes wavy-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-${AMPLITUDE}px); }
}
@media (prefers-reduced-motion: reduce) {
  .wavy-char { animation: none; }
}
`

export default function WavyTextDemo() {
  useEffect(() => {
    if (document.getElementById('wavy-demo-css')) return
    const style = document.createElement('style')
    style.id = 'wavy-demo-css'
    style.textContent = CSS
    document.head.appendChild(style)
  }, [])

  let animatedIndex = 0

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '50vh', background: '#0a0a12' }}>
      <h2 aria-label={TEXT} style={{ color: '#38bdf8', fontFamily: 'system-ui', fontSize: '2.5rem' }}>
        {Array.from(TEXT).map((ch, i) =>
          /\s/.test(ch) ? (
            <span key={i} className="wavy-space" aria-hidden="true">
              {ch}
            </span>
          ) : (
            <span
              key={i}
              className="wavy-char"
              aria-hidden="true"
              // Delay negativo: la ola ya está en curso al montar.
              style={{ animationDelay: `${-STAGGER * animatedIndex++}s` }}
            >
              {ch}
            </span>
          ),
        )}
      </h2>
    </div>
  )
}
