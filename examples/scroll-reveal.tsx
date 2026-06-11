// scroll-reveal.tsx — Contenido que se revela al entrar al viewport, con stagger.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Un IntersectionObserver togglea un atributo en el contenedor; la entrada
// es una CSS transition pura (cero JS por frame). Cada hijo lleva un
// transition-delay incremental para el efecto cascada.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de
// tipo inline (`: number`, `: ReactNode`).

import { useEffect, useRef, type ReactNode } from 'react'

const DISTANCE = 24 // px de desplazamiento inicial
const DURATION = 0.6 // segundos
const STAGGER = 0.15 // segundos entre hijos

const STYLE_ID = 'scroll-reveal-demo-styles'
const CSS = `
.reveal-demo > * {
  opacity: 0;
  translate: 0 ${DISTANCE}px;
  transition:
    opacity ${DURATION}s cubic-bezier(0.22, 1, 0.36, 1),
    translate ${DURATION}s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal-demo[data-visible] > * {
  opacity: 1;
  translate: 0 0;
}
@media (prefers-reduced-motion: reduce) {
  .reveal-demo > * {
    opacity: 1;
    translate: 0 0;
    transition: none;
  }
}
`

function ScrollReveal({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = CSS
      document.head.appendChild(style)
    }

    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      element.setAttribute('data-visible', '')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.setAttribute('data-visible', '')
          observer.disconnect() // revela una sola vez
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="reveal-demo">
      {Array.isArray(children)
        ? children.map((child, i: number) => (
            <div key={i} style={{ transitionDelay: `${i * STAGGER}s` }}>
              {child}
            </div>
          ))
        : children}
    </div>
  )
}

export default function ScrollRevealDemo() {
  return (
    <div style={{ background: '#050510', color: '#eee' }}>
      <div style={{ height: '120vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Scrolleá para revelar ↓</p>
      </div>
      <div style={{ minHeight: '80vh', padding: '4rem 2rem' }}>
        <ScrollReveal>
          <h2 style={{ marginTop: 0 }}>Primero</h2>
          <p style={{ opacity: 0.7 }}>Entra apenas la sección toca el viewport.</p>
          <p style={{ opacity: 0.7 }}>Cada hijo espera su turno (stagger).</p>
        </ScrollReveal>
      </div>
    </div>
  )
}
