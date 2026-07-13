'use client'
import { useEffect, useState, type RefObject } from 'react'

export interface MousePosition {
  x: number
  y: number
}

/**
 * Tracks the mouse position relative to the referenced element.
 *
 * Returns `{x, y}` in pixels from the element's top-left corner, or `null`
 * while the cursor is outside of it. Event listeners are registered on the
 * element and cleaned up on unmount.
 */
export function useMousePosition(ref: RefObject<HTMLElement | null>): MousePosition | null {
  const [position, setPosition] = useState<MousePosition | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const onMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top })
    }
    const onMouseLeave = () => setPosition(null)

    element.addEventListener('mousemove', onMouseMove)
    element.addEventListener('mouseleave', onMouseLeave)
    return () => {
      element.removeEventListener('mousemove', onMouseMove)
      element.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [ref])

  return position
}
