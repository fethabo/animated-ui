// typewriter-text.tsx — Texto revelado carácter por carácter (máquina de escribir).
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Un loop de requestAnimationFrame muta `textContent` directamente (sin
// re-renders por frame), progresando por timestamps. Con un arreglo de strings
// cicla escribe→pausa→borra→siguiente. El cursor parpadea con CSS (sin JS por
// frame). Los lectores de pantalla ven el texto completo: el root lleva
// `aria-label` y el span que muta está `aria-hidden`.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const SPEED = 30 // caracteres escritos por segundo
const DELETE_SPEED = 30 // caracteres borrados por segundo (modo loop)
const PAUSE = 1500 // ms con el string completo antes de borrar

const STYLE_ID = 'typewriter-demo-styles'
const CSS = `
.tw-cursor { display: inline-block; animation: tw-blink 1s step-end infinite; }
@keyframes tw-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .tw-cursor { animation: none; } }
`

function sliceCp(str: string, n: number): string {
  return Array.from(str).slice(0, Math.max(0, n)).join('')
}

function TypewriterText({ text, loop = false }: { text: string | string[]; loop?: boolean }) {
  const innerRef = useRef<HTMLSpanElement>(null)
  const strings = Array.isArray(text) ? text : [text]

  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = CSS
      document.head.appendChild(style)
    }

    const el = innerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = strings[0]
      return
    }

    // Timeline del ciclo: por cada string, escribir + pausar + borrar.
    const segs = strings.map((s) => {
      const len = Array.from(s).length
      return { s, len, typeDur: (len / SPEED) * 1000, delDur: (len / DELETE_SPEED) * 1000 }
    })
    const cycle = segs.reduce((sum, g) => sum + g.typeDur + PAUSE + g.delDur, 0)

    let raf = 0
    let start: number | null = null
    const step = (now: number) => {
      if (start === null) start = now
      const t = now - start

      if (!loop) {
        const target = strings[0]
        const typed = Math.floor((t / 1000) * SPEED)
        el.textContent = sliceCp(target, typed)
        if (typed < Array.from(target).length) raf = requestAnimationFrame(step)
        else el.textContent = target
        return
      }

      let local = cycle > 0 ? t % cycle : 0
      for (const g of segs) {
        if (local < g.typeDur) {
          el.textContent = sliceCp(g.s, Math.floor((local / 1000) * SPEED))
          break
        }
        local -= g.typeDur
        if (local < PAUSE) {
          el.textContent = g.s
          break
        }
        local -= PAUSE
        if (local < g.delDur) {
          el.textContent = sliceCp(g.s, g.len - Math.floor((local / 1000) * DELETE_SPEED))
          break
        }
        local -= g.delDur
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [strings.join(' '), loop])

  return (
    <span aria-label={strings.join(', ')}>
      <span ref={innerRef} aria-hidden="true">
        {strings[0]}
      </span>
      <span className="tw-cursor" aria-hidden="true">
        |
      </span>
    </span>
  )
}

export default function TypewriterTextDemo() {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: '2rem',
        minHeight: '60vh',
        background: '#050510',
        color: '#e2e8f0',
        fontFamily: 'monospace', // anchos estables: el cursor no hace saltar el texto
      }}
    >
      <h1 style={{ fontSize: '2.5rem', margin: 0 }}>
        <TypewriterText text="Hola, soy una máquina de escribir." />
      </h1>
      <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#f472b6' }}>
        Hago{' '}
        <TypewriterText text={['Diseño', 'Código', 'Arte']} loop />
      </h2>
    </div>
  )
}
