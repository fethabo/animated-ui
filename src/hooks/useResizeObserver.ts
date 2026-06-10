'use client'
import { useEffect, useState, type RefObject } from 'react'

export interface ElementSize {
  width: number
  height: number
}

/**
 * Observa las dimensiones del elemento referenciado y las retorna como
 * `{width, height}`, actualizándose ante cualquier resize (responsive,
 * cambios de layout, etc.). Usa `ResizeObserver` y se desconecta al
 * desmontar. Antes de la primera medición retorna `{0, 0}`.
 */
export function useResizeObserver(ref: RefObject<HTMLElement | null>): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return size
}
