'use client'
import { useCallback, useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react'
import { DEFAULT_CHARSET, scrambleFrame } from './scramble'
import type { ScrambleTextProps, ScrambleTrigger } from './types'

export type { ScrambleTextProps, ScrambleTrigger } from './types'

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

// Chequeo imperativo (no el hook useReducedMotion): el hook reporta `false`
// en el primer render y se corrige recién en su effect, demasiado tarde para
// decidir si el scramble de mount debe arrancar.
function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(REDUCE_QUERY).matches
  )
}

/**
 * Texto que se "descifra" carácter por carácter (efecto decrypt/Matrix).
 *
 * El render (server y primer render de cliente) produce el texto final; el
 * loop RAF muta `textContent` via ref sin pasar por React. Los lectores de
 * pantalla ven siempre el texto final estable: el root expone `aria-label`
 * y el span que muta está `aria-hidden`.
 */
export function ScrambleText({
  text,
  speed = 25,
  charset = DEFAULT_CHARSET,
  trigger = 'mount',
  scrambleColor,
  respectReducedMotion = true,
  className,
  style,
  onMouseEnter,
  ...rest
}: ScrambleTextProps) {
  const innerRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef(0)
  const mountedRef = useRef(false)

  // El loop y los handlers leen las opciones vigentes de este ref para que
  // un cambio de speed/charset/trigger no reinicie el scramble en curso.
  const optsRef = useRef<{ speed: number; charset: string; trigger: ScrambleTrigger; respectReducedMotion: boolean }>({
    speed,
    charset,
    trigger,
    respectReducedMotion,
  })
  useEffect(() => {
    optsRef.current = { speed, charset, trigger, respectReducedMotion }
  })

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
  }, [])

  const startScramble = useCallback(() => {
    const el = innerRef.current
    if (!el || typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') return
    stop()

    const total = Array.from(text).length
    // Durante el scramble el span toma --aui-scramble-color (cascada del
    // consumer o prop); al terminar se limpia y vuelve a heredar.
    el.style.color = 'var(--aui-scramble-color, currentColor)'

    let startTime: number | null = null
    const step = (now: number) => {
      if (startTime === null) startTime = now
      // Progresión por timestamps, no por conteo de frames: misma duración
      // en displays de 60 y 144 Hz.
      const revealed = Math.floor(((now - startTime) / 1000) * optsRef.current.speed)
      if (revealed >= total) {
        el.textContent = text
        el.style.removeProperty('color')
        rafRef.current = 0
        return
      }
      el.textContent = scrambleFrame(text, revealed, optsRef.current.charset, Math.random)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }, [text, stop])

  useEffect(() => {
    const { trigger: currentTrigger, respectReducedMotion: respect } = optsRef.current
    const isMount = !mountedRef.current
    mountedRef.current = true

    // El reveal de mount/cambio de text es autónomo: se apaga con reduced
    // motion. Con trigger 'hover' el mount tampoco anima (espera al cursor).
    if ((respect && prefersReducedMotion()) || (currentTrigger === 'hover' && isMount)) {
      const el = innerRef.current
      if (el) {
        el.textContent = text
        el.style.removeProperty('color')
      }
      return
    }
    startScramble()
    return stop
  }, [text, startScramble, stop])

  const handleMouseEnter = (event: ReactMouseEvent<HTMLSpanElement>) => {
    const { trigger: currentTrigger } = optsRef.current
    // Input directo del usuario: queda activo aun con reduced motion.
    if (currentTrigger === 'hover' || currentTrigger === 'both') startScramble()
    onMouseEnter?.(event)
  }

  return (
    <span
      aria-label={text}
      className={`aui-scramble${className ? ` ${className}` : ''}`}
      style={{
        ...(scrambleColor !== undefined ? { '--aui-scramble-color': scrambleColor } : undefined),
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      {...rest}
    >
      <span ref={innerRef} aria-hidden="true">
        {text}
      </span>
    </span>
  )
}
