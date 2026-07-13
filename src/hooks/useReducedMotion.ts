'use client'
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Returns `true` if the user has the reduced-motion preference enabled in
 * their operating system.
 *
 * SSR-safe: on the server (and on the first client render, to avoid a
 * hydration mismatch) it returns `false`; the real value is read in
 * `useEffect`. Reacts live if the preference changes while the component
 * is mounted.
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
