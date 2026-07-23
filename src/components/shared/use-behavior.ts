'use client'
import { useCallback, useEffect, useRef } from 'react'

/** Contrato mínimo que devuelve el `attach` de todo motor de comportamiento. */
export interface BehaviorInstance<O> {
  update(patch: Partial<O>): void
  destroy(): void
}

function shallowEqual(a: object, b: object): boolean {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  const recordA = a as Record<string, unknown>
  const recordB = b as Record<string, unknown>
  return keysA.every((key) => Object.is(recordA[key], recordB[key]))
}

/**
 * Ciclo de vida React compartido por los behavior hooks (useTilt,
 * useMagnetic, useSpotlight, useGlowBorder): devuelve un callback ref
 * estable que ata el motor al nodo del consumer.
 *
 * - Nodo nuevo o `null` → destruye la instancia anterior antes de atar.
 * - Opciones nuevas (shallow-compare por render) → `update()` en vivo,
 *   sin re-atar; el consumer no necesita memoizar el objeto.
 * - StrictMode: el cleanup del effect destruye y el re-run re-ata sobre
 *   el nodo vigente, sin duplicar listeners ni capas.
 */
export function useBehavior<O extends object>(
  attach: (node: HTMLElement, options: O) => BehaviorInstance<O>,
  options: O,
): (node: HTMLElement | null) => void {
  const instanceRef = useRef<BehaviorInstance<O> | null>(null)
  const nodeRef = useRef<HTMLElement | null>(null)
  const optionsRef = useRef(options)
  const attachRef = useRef(attach)
  attachRef.current = attach

  const ref = useCallback((node: HTMLElement | null) => {
    if (node === nodeRef.current) return
    instanceRef.current?.destroy()
    instanceRef.current = null
    nodeRef.current = node
    if (node) instanceRef.current = attachRef.current(node, optionsRef.current)
  }, [])

  useEffect(() => {
    if (!shallowEqual(optionsRef.current, options)) {
      optionsRef.current = options
      instanceRef.current?.update(options)
    }
  })

  useEffect(() => {
    // Re-attach tras el desmontaje simulado de StrictMode (el callback ref
    // no vuelve a dispararse, pero el nodo sigue montado).
    if (!instanceRef.current && nodeRef.current) {
      instanceRef.current = attachRef.current(nodeRef.current, optionsRef.current)
    }
    return () => {
      instanceRef.current?.destroy()
      instanceRef.current = null
    }
  }, [])

  return ref
}
