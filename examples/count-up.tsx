// count-up.tsx — Número que cuenta hasta su valor al entrar al viewport, con
// easing de salida y formato con separador de miles.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Un IntersectionObserver dispara la cuenta la primera vez que el elemento
// entra al viewport; un requestAnimationFrame muta textContent por ref (cero
// re-renders por frame) con progresión por timestamps y ease-out cúbico. El
// markup inicial ya contiene el valor final (SEO-safe y correcto sin JS) y el
// aria-label anuncia siempre el valor definitivo. Con prefers-reduced-motion
// se queda en el valor final sin animar. font-variant-numeric: tabular-nums
// evita que el ancho "baile" durante la cuenta.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const VALUE = 12500
const FROM = 0
const DURATION = 2500 // ms
const SEPARATOR = '.'
const SUFFIX = '+'

function format(value: number): string {
  const int = Math.round(value).toString()
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, SEPARATOR) + SUFFIX
}

export default function CountUpDemo() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()

      let startTime: number | null = null
      const step = (now: number) => {
        if (startTime === null) startTime = now
        const t = Math.min(1, (now - startTime) / DURATION)
        const eased = 1 - (1 - t) ** 3 // ease-out cúbico: frena al llegar
        el.textContent = format(FROM + (VALUE - FROM) * eased)
        if (t < 1) rafId = requestAnimationFrame(step)
      }
      rafId = requestAnimationFrame(step)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '50vh', background: '#0a0a12' }}>
      <p style={{ color: '#e5e5e5', fontFamily: 'system-ui', textAlign: 'center' }}>
        <span
          ref={ref}
          aria-label={format(VALUE)}
          style={{
            display: 'block',
            fontSize: '4rem',
            fontWeight: 700,
            color: '#38bdf8',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {format(VALUE)}
        </span>
        proyectos animados
      </p>
    </div>
  )
}
