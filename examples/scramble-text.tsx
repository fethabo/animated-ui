// scramble-text.tsx — Texto que se "descifra" carácter por carácter.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Un loop de requestAnimationFrame muta `textContent` directamente (sin
// re-renders de React por frame), revelando el texto por timestamps. Los
// lectores de pantalla ven siempre el texto final: el root lleva
// `aria-label` y el span que muta está `aria-hidden`.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de
// tipo inline (`: string`, `: number`).

import { useEffect, useRef } from 'react'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&?!<>+=*'
const SPEED = 25 // caracteres revelados por segundo

function scrambleFrame(text: string, revealed: number): string {
  const chars = Array.from(text) // por code points, no parte emoji
  const pool = Array.from(CHARSET)
  let frame = ''
  for (let i = 0; i < chars.length; i++) {
    if (i < revealed || /\s/.test(chars[i])) frame += chars[i]
    else frame += pool[Math.floor(Math.random() * pool.length)]
  }
  return frame
}

function ScrambleText({ text }: { text: string }) {
  const innerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = text
      return
    }

    const total = Array.from(text).length
    let raf = 0
    let startTime: number | null = null
    const step = (now: number) => {
      if (startTime === null) startTime = now
      const revealed = Math.floor(((now - startTime) / 1000) * SPEED)
      if (revealed >= total) {
        el.textContent = text
        return
      }
      el.textContent = scrambleFrame(text, revealed)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [text])

  return (
    <span aria-label={text}>
      <span ref={innerRef} aria-hidden="true">
        {text}
      </span>
    </span>
  )
}

export default function ScrambleTextDemo() {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '60vh',
        background: '#050510',
        color: '#4ade80',
        fontFamily: 'monospace', // los anchos estables evitan jitter durante el scramble
      }}
    >
      <h1 style={{ fontSize: '2.5rem', margin: 0 }}>
        <ScrambleText text="Acceso concedido: bienvenido" />
      </h1>
    </div>
  )
}
