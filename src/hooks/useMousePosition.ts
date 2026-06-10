'use client'
import { useEffect, useState, type RefObject } from 'react'

export interface MousePosition {
  x: number
  y: number
}

/**
 * Trackea la posición del mouse relativa al elemento referenciado.
 *
 * Retorna `{x, y}` en píxeles desde la esquina superior izquierda del
 * elemento, o `null` cuando el cursor está fuera de él. Los event listeners
 * se registran sobre el elemento y se limpian al desmontar.
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
