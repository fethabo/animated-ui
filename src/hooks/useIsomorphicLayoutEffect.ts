'use client'
import { useEffect, useLayoutEffect } from 'react'

/**
 * `useLayoutEffect` en el cliente, `useEffect` en SSR: React advierte si un
 * componente con `useLayoutEffect` se renderiza en el servidor (donde no
 * puede correr). Lo usan los componentes del motor SVG stroke para
 * "rebobinar" los trazos antes del primer paint del cliente, minimizando el
 * flash post-hidratación (design.md de Wave L, decisión 2). Interno al
 * paquete.
 */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect
