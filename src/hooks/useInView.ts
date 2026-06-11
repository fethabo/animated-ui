'use client'
import { useEffect, useState, type RefObject } from 'react'

export interface UseInViewOptions {
  /** Fracción del elemento que debe ser visible para considerarlo en viewport. Default: `0.15`. */
  threshold?: number
  /** Margen alrededor del viewport para adelantar/retrasar la intersección. Default: `'0px'`. */
  rootMargin?: string
  /**
   * Si es `true`, deja de observar tras la primera intersección y el valor
   * queda en `true`. Con `false`, el valor sigue a la visibilidad. Default: `true`.
   */
  once?: boolean
}

/**
 * Retorna `true` cuando el elemento referenciado interseca el viewport,
 * observándolo con IntersectionObserver.
 *
 * SSR-safe: en el servidor (y en el primer render del cliente, para evitar
 * hydration mismatch) retorna `false`; la observación arranca en `useEffect`.
 * Si el entorno no tiene IntersectionObserver, retorna `true` tras el primer
 * effect: lo seguro para un reveal es mostrar el contenido, nunca dejarlo
 * oculto para siempre.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { threshold = 0.15, rootMargin = '0px', once = true }: UseInViewOptions = {},
): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, threshold, rootMargin, once])

  return inView
}
