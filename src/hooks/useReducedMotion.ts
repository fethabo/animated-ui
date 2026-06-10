'use client'
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Retorna `true` si el usuario tiene activada la preferencia de movimiento
 * reducido en su sistema operativo.
 *
 * SSR-safe: en el servidor (y en el primer render del cliente, para evitar
 * hydration mismatch) retorna `false`; el valor real se lee en `useEffect`.
 * Reacciona en vivo si la preferencia cambia mientras el componente está
 * montado.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia(QUERY)
    setReduced(mediaQuery.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  return reduced
}
