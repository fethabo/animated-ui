'use client'
import { useRef, type CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import { cancelTracked, createTracker, hasTracked, playKeyframes } from '../../utils/flip-play'
import type { AutoHeightProps } from './types'

export type { AutoHeightProps } from './types'

/** Debajo de este delta (px) el cambio de tamaño no vale una transición. */
const EPSILON = 0.5

// Igual que en AnimatedList: resolver en el play para que un override de la
// CSS var en cascada gane sobre el default de la prop.
function resolveEasing(root: HTMLElement, fallback: string): string {
  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
    return fallback
  }
  const value = window.getComputedStyle(root).getPropertyValue('--aui-autoheight-easing').trim()
  return value || fallback
}

function resolveDuration(root: HTMLElement, fallback: number): number {
  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
    return fallback
  }
  const value = parseFloat(
    window.getComputedStyle(root).getPropertyValue('--aui-autoheight-duration'),
  )
  return Number.isFinite(value) ? value : fallback
}

/**
 * Contenedor que transiciona su altura (y opcionalmente su ancho, con
 * `width`) cuando el contenido cambia de tamaño — acordeones, tabs,
 * disclosure, textos expandibles: la forma de animar `height: auto`. Detecta
 * cambios de children entre renders (pre-paint, sin salto visible) y resizes
 * del contenido via `ResizeObserver`, y anima entre la altura anterior y la
 * nueva con WAAPI, con `overflow: hidden` solo durante la transición. La
 * altura real nunca se fija inline: al terminar, el efecto WAAPI expira y el
 * contenedor queda en `height: auto`, siguiendo el flujo normal del layout.
 *
 * Si el contenido vuelve a cambiar en vuelo, la transición se redirige desde
 * la altura visual actual, sin saltos. Trade-off documentado: animar `height`
 * relayoutea por frame — el costo es local al contenedor y la duración corta.
 *
 * Con `prefers-reduced-motion` el ajuste es instantáneo (sigue en `auto`).
 * SSR-safe: el markup del servidor fluye con su altura natural.
 */
export function AutoHeight({
  duration = 0.3,
  easing = 'ease',
  width = false,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: AutoHeightProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const trackerRef = useRef(createTracker())
  const lastSizeRef = useRef<{ h: number; w: number } | null>(null)

  const reducedMotion = useReducedMotion()
  const isStatic = respectReducedMotion && reducedMotion

  // Re-render cuando el contenido cambia de tamaño sin pasar por React
  // (imágenes que cargan, estado anidado): la medición vive en el layout
  // effect de abajo, que corre en cada commit.
  useResizeObserver(contentRef)

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    const content = contentRef.current
    if (!root) return

    const tracker = trackerRef.current
    // Interrupción: la altura visual actual se lee ANTES de cancelar (el
    // gBCR refleja la animación de height en vuelo); tras cancelar, el
    // contenedor vuelve a `auto` y el gBCR da el tamaño destino.
    const inFlight = hasTracked(tracker, root) ? root.getBoundingClientRect() : null
    cancelTracked(tracker, root)
    const target = root.getBoundingClientRect()

    const last = lastSizeRef.current
    lastSizeRef.current = { h: target.height, w: target.width }

    // Primera medición (montaje/hidratación) o reduced motion: sin animar.
    if (!last || isStatic) return

    const fromH = inFlight ? inFlight.height : last.h
    const fromW = inFlight ? inFlight.width : last.w
    const heightChanged = Math.abs(fromH - target.height) > EPSILON
    const widthChanged = width && Math.abs(fromW - target.width) > EPSILON
    if (!heightChanged && !widthChanged) return

    // Los valores medidos son border-box: los keyframes fijan box-sizing para
    // que `height`/`width` se interpreten igual, tenga lo que tenga el root.
    const from: Keyframe = { height: `${fromH}px`, overflow: 'hidden', boxSizing: 'border-box' }
    const to: Keyframe = {
      height: `${target.height}px`,
      overflow: 'hidden',
      boxSizing: 'border-box',
    }
    if (width) {
      from.width = `${fromW}px`
      to.width = `${target.width}px`
      // Con el ancho animando, el contenido se fija al ancho destino durante
      // la transición: no reflowea por frame ni realimenta al ResizeObserver.
      if (content) content.style.width = `${content.getBoundingClientRect().width}px`
    }

    playKeyframes(
      tracker,
      root,
      [from, to],
      { duration: resolveDuration(root, duration) * 1000, easing: resolveEasing(root, easing) },
      () => {
        if (content) content.style.width = ''
      },
    )
  })

  return (
    <div
      ref={rootRef}
      className={`aui-autoheight${className ? ` ${className}` : ''}`}
      style={
        {
          '--aui-autoheight-easing': easing,
          '--aui-autoheight-duration': `${duration}s`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <div ref={contentRef} className="aui-autoheight-content">
        {children}
      </div>
    </div>
  )
}
