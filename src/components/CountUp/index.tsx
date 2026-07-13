'use client'
import { useEffect, useRef } from 'react'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { easeOut, formatValue } from './format'
import type { CountUpProps } from './types'

export type { CountUpProps } from './types'

/**
 * Número que cuenta desde `from` hasta `value` al entrar al viewport, con
 * easing de salida (arranque rápido, frenado al llegar). El RAF muta
 * `textContent` por ref (patrón ScrambleText): cero re-renders por frame.
 * Corre una sola vez por montaje.
 *
 * SEO-safe: el markup SSR contiene el valor final formateado; el texto se
 * resetea al valor inicial recién cuando la cuenta arranca. Accesible: el
 * root expone el valor final en `aria-label` y el span que muta está
 * `aria-hidden`. Con reduced motion se muestra el valor final directo
 * (coincide con el markup SSR — cero salto visual).
 *
 * Tip: aplicá `font-variant-numeric: tabular-nums` para que el ancho no
 * "baile" durante la cuenta.
 */
export function CountUp({
  value,
  from = 0,
  duration = 2000,
  decimals = 0,
  separator = '',
  prefix = '',
  suffix = '',
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: CountUpProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const startedRef = useRef(false)
  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  const inView = useInView(rootRef, { once: true })

  // La cuenta lee las opciones vigentes de este ref: un cambio de props
  // mid-animación no reinicia ni congela la cuenta en curso.
  const optsRef = useRef({ value, from, duration, decimals, separator, prefix, suffix, isStatic })
  useEffect(() => {
    optsRef.current = { value, from, duration, decimals, separator, prefix, suffix, isStatic }
  })

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    const el = innerRef.current
    if (!el) return
    const { value, from, duration, decimals, separator, prefix, suffix, isStatic } = optsRef.current
    const format = { decimals, separator, prefix, suffix }

    // Sin animación posible (reduced motion, sin RAF, duración nula): el
    // valor final ya está en el DOM desde el render — no hay nada que hacer.
    if (
      isStatic ||
      duration <= 0 ||
      typeof window === 'undefined' ||
      typeof window.requestAnimationFrame !== 'function'
    ) {
      el.textContent = formatValue(value, format)
      return
    }

    let rafId = 0
    let startTime: number | null = null
    const step = (now: number) => {
      if (startTime === null) startTime = now
      // Progresión por timestamps, no por conteo de frames: misma duración
      // en displays de 60 y 144 Hz.
      const t = Math.min(1, (now - startTime) / duration)
      el.textContent = formatValue(from + (value - from) * easeOut(t), format)
      rafId = t < 1 ? requestAnimationFrame(step) : 0
    }
    rafId = requestAnimationFrame(step)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [inView])

  const finalText = formatValue(value, { decimals, separator, prefix, suffix })

  return (
    <span
      ref={rootRef}
      aria-label={finalText}
      className={`aui-countup${className ? ` ${className}` : ''}`}
      style={style}
      {...rest}
    >
      <span ref={innerRef} aria-hidden="true">
        {finalText}
      </span>
    </span>
  )
}
