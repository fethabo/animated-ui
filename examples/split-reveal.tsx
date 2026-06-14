// split-reveal.tsx — Texto partido en palabras que se revelan con stagger.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El texto se renderiza completo (SSR/SEO) y se parte en spans tras montar.
// La entrada es una CSS transition pura (cero JS por frame): un
// IntersectionObserver togglea un atributo y cada palabra lleva un
// transition-delay incremental. El root porta `aria-label` con el texto
// completo y las palabras son `aria-hidden`, así el lector de pantalla
// anuncia el texto original, no los fragmentos.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef, useState } from 'react'

const STAGGER = 0.05 // segundos entre palabras
const DURATION = 0.6 // segundos
const DISTANCE = 16 // px de desplazamiento inicial (slide-up)

const STYLE_ID = 'split-reveal-demo-styles'
const CSS = `
.sr-unit {
  display: inline-block;
  white-space: pre;
  opacity: 0;
  translate: 0 ${DISTANCE}px;
  transition:
    opacity ${DURATION}s cubic-bezier(0.22, 1, 0.36, 1),
    translate ${DURATION}s cubic-bezier(0.22, 1, 0.36, 1);
}
.sr[data-visible] .sr-unit { opacity: 1; translate: 0 0; }
@media (prefers-reduced-motion: reduce) {
  .sr-unit { opacity: 1; translate: 0 0; transition: none; }
}
`

function SplitReveal({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = CSS
      document.head.appendChild(style)
    }
    setMounted(true)

    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.setAttribute('data-visible', '')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-visible', '')
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Runs alternados de espacio / no-espacio: las palabras animan, los espacios
  // se emiten como texto para preservar el espaciado y los cortes de línea.
  const runs = text.match(/\s+|\S+/gu) ?? []
  let i = 0
  return (
    <span ref={ref} className="sr" aria-label={text}>
      {mounted
        ? runs.map((run, k) => {
            if (/\s/.test(run[0])) {
              return (
                <span key={k} aria-hidden="true">
                  {run}
                </span>
              )
            }
            const idx = i++
            return (
              <span
                key={k}
                className="sr-unit"
                aria-hidden="true"
                style={{ transitionDelay: `${idx * STAGGER}s` }}
              >
                {run}
              </span>
            )
          })
        : text}
    </span>
  )
}

export default function SplitRevealDemo() {
  return (
    <div style={{ background: '#050510', color: '#e2e8f0', fontFamily: 'system-ui' }}>
      <div style={{ height: '110vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Scrolleá para revelar ↓</p>
      </div>
      <div style={{ minHeight: '80vh', padding: '4rem 2rem', maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', lineHeight: 1.2 }}>
          <SplitReveal text="Cada palabra entra desde abajo, una tras otra, con un stagger sutil." />
        </h1>
      </div>
    </div>
  )
}
