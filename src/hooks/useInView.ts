'use client'
import { useEffect, useState, type RefObject } from 'react'

export interface UseInViewOptions {
  /** Fraction of the element that must be visible to consider it in the viewport. Default: `0.15`. */
  threshold?: number
  /** Margin around the viewport to advance/delay the intersection. Default: `'0px'`. */
  rootMargin?: string
  /**
   * If `true`, stops observing after the first intersection and the value
   * stays `true`. With `false`, the value tracks visibility. Default: `true`.
   */
  once?: boolean
}

/**
 * Returns `true` when the referenced element intersects the viewport,
 * observing it with IntersectionObserver.
 *
 * SSR-safe: on the server (and on the first client render, to avoid a
 * hydration mismatch) it returns `false`; observation starts in `useEffect`.
 * If the environment lacks IntersectionObserver, it returns `true` after the
 * first effect: the safe behavior for a reveal is to show the content, never
 * to leave it hidden forever.
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
