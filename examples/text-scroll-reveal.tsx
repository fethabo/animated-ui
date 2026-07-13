// text-scroll-reveal.tsx — Palabras que se "encienden" progresivamente según
// el avance del scroll (highlight progresivo), reversibles al scrollear atrás.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Un listener pasivo de scroll (coalescido por requestAnimationFrame) escribe
// una única CSS var de progreso (0→1) en el párrafo; cada palabra resuelve su
// opacidad con calc() a partir de su índice — cero JS por palabra por frame.
// El texto completo va en aria-label y las palabras son aria-hidden. Con
// prefers-reduced-motion el texto queda encendido y estático.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const TEXT =
  'Cada palabra de este párrafo se enciende a medida que scrolleás, y se vuelve a apagar si scrolleás hacia atrás.'
const FROM_OPACITY = 0.15
const OFFSET: [number, number] = [0.2, 0.6] // porción del recorrido donde ocurre el encendido

const CSS = `
.tsr-word {
  opacity: calc(${FROM_OPACITY} + ${1 - FROM_OPACITY} * clamp(0, calc(var(--tsr-progress, 0) * var(--tsr-n, 1) - var(--tsr-i, 0)), 1));
}
.tsr-space { white-space: pre; }
@media (prefers-reduced-motion: reduce) {
  .tsr-word { opacity: 1; }
}
`

export default function TextScrollRevealDemo() {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!document.getElementById('tsr-demo-css')) {
      const style = document.createElement('style')
      style.id = 'tsr-demo-css'
      style.textContent = CSS
      document.head.appendChild(style)
    }

    const root = ref.current
    if (!root) return

    let rafId = 0
    const update = () => {
      rafId = 0
      const rect = root.getBoundingClientRect()
      // Progreso del párrafo por el viewport, normalizado a [0, 1].
      const range = (window.innerHeight + rect.height) / 2
      const advance = window.innerHeight / 2 - rect.top - rect.height / 2
      const journey = (Math.max(-1, Math.min(1, advance / range)) + 1) / 2
      // Remapeado al rango OFFSET donde ocurre el encendido.
      const [start, end] = OFFSET
      const progress = Math.max(0, Math.min(1, (journey - start) / (end - start)))
      root.style.setProperty('--tsr-progress', String(progress))
    }
    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    schedule()
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const words = TEXT.split(/(\s+)/).filter(Boolean)
  const wordCount = words.filter((w) => !/\s/.test(w[0])).length
  let wordIndex = 0

  return (
    <div style={{ background: '#0a0a12', padding: '120vh 0' }}>
      <p
        ref={ref}
        aria-label={TEXT}
        style={
          {
            '--tsr-n': wordCount,
            maxWidth: 640,
            margin: '0 auto',
            color: '#e5e5e5',
            fontFamily: 'system-ui',
            fontSize: '2rem',
            fontWeight: 600,
          } as React.CSSProperties
        }
      >
        {words.map((word, i) =>
          /\s/.test(word[0]) ? (
            <span key={i} className="tsr-space" aria-hidden="true">
              {word}
            </span>
          ) : (
            <span
              key={i}
              className="tsr-word"
              aria-hidden="true"
              style={{ '--tsr-i': wordIndex++ } as React.CSSProperties}
            >
              {word}
            </span>
          ),
        )}
      </p>
    </div>
  )
}
