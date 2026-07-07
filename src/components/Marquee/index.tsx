'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { subscribeScroll } from '../../utils/scroll-driver'
import { cycleDuration, repeatCount } from './repeat'
import type { MarqueeProps } from './types'

export type { MarqueeDirection, MarqueeProps } from './types'

// El loop sin costura traslada la pista exactamente media pista por ciclo
// (las dos mitades son idénticas); el `- gap/2` compensa el gap central.
// El skew de `scrollVelocity` vive en los grupos (el transform de la pista
// lo consume la animación) con una transition que lo relaja al detenerse.
const CSS = `
.aui-marquee {
  overflow: hidden;
  display: flex;
}
.aui-marquee-track {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: max-content;
  gap: var(--aui-marquee-gap, 24px);
  animation: aui-marquee-x var(--aui-marquee-duration, 20s) linear infinite;
}
.aui-marquee-group {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: var(--aui-marquee-gap, 24px);
  transform: skewX(var(--aui-marquee-skew, 0deg));
  transition: transform 0.3s ease-out;
}
.aui-marquee[data-aui-vertical] .aui-marquee-track {
  flex-direction: column;
  width: auto;
  height: max-content;
  animation-name: aui-marquee-y;
}
.aui-marquee[data-aui-vertical] .aui-marquee-group {
  flex-direction: column;
  transform: skewY(var(--aui-marquee-skew, 0deg));
}
.aui-marquee[data-aui-reverse] .aui-marquee-track {
  animation-direction: reverse;
}
.aui-marquee[data-aui-pause]:hover .aui-marquee-track {
  animation-play-state: paused;
}
.aui-marquee[data-aui-static] .aui-marquee-track {
  animation: none;
}
.aui-marquee[data-aui-fade] {
  mask-image: linear-gradient(to right, transparent, #000 48px, #000 calc(100% - 48px), transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, #000 48px, #000 calc(100% - 48px), transparent);
}
.aui-marquee[data-aui-fade][data-aui-vertical] {
  mask-image: linear-gradient(to bottom, transparent, #000 48px, #000 calc(100% - 48px), transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 48px, #000 calc(100% - 48px), transparent);
}
@keyframes aui-marquee-x {
  to { transform: translateX(calc(-50% - var(--aui-marquee-gap, 24px) / 2)); }
}
@keyframes aui-marquee-y {
  to { transform: translateY(calc(-50% - var(--aui-marquee-gap, 24px) / 2)); }
}
`

/** Tope del boost de velocidad con `scrollVelocity`. */
const MAX_BOOST = 3
/** Tope del skew en grados con `scrollVelocity`. */
const MAX_SKEW = 8
/** Ms sin scroll tras los que la cinta vuelve a su estado base. */
const VELOCITY_RESET_MS = 150

/**
 * Cinta infinita de contenido (logos, testimonios) con desplazamiento
 * continuo CSS puro — sin JS por frame en el modo base. El contenido se
 * duplica internamente (las copias, `aria-hidden`: los lectores lo anuncian
 * una sola vez) y, si es más angosto que el contenedor, se repite hasta
 * llenar la pista (medición por observer, no por frame). El loop es sin
 * costura: la pista traslada exactamente una mitad por ciclo.
 *
 * `scrollVelocity` (opt-in) acopla velocidad y un skew sutil a la velocidad
 * de scroll via el scroll-driver del paquete — CSS vars y `playbackRate`
 * escritos por ref, sin re-renders. Sin la prop, no hay suscripción a scroll.
 *
 * Con `prefers-reduced-motion` el contenido queda estático en una sola
 * pasada, sin duplicados. Las direcciones `up`/`down` (columnas) requieren
 * que el consumer acote la altura del componente.
 */
export function Marquee({
  direction = 'left',
  speed = 60,
  pauseOnHover = false,
  scrollVelocity = false,
  gap = 24,
  fadeEdges = false,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const [repeats, setRepeats] = useState(1)

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(rootRef)
  const isStatic = respectReducedMotion && reducedMotion
  const vertical = direction === 'up' || direction === 'down'
  const reverse = direction === 'right' || direction === 'down'

  useEffect(() => {
    injectStyles(styleId('marquee'), CSS)
  }, [])

  // Medición única (por cambio de tamaño, no por frame): repeticiones para
  // cubrir el contenedor y duración del ciclo según `speed` (px/s).
  useEffect(() => {
    const group = groupRef.current
    const track = trackRef.current
    if (!group || !track || isStatic) return
    const containerSize = vertical ? size.height : size.width
    const contentSize = vertical ? group.offsetHeight : group.offsetWidth
    if (containerSize <= 0 || contentSize <= 0) return
    const nextRepeats = repeatCount(contentSize + gap, containerSize)
    if (nextRepeats !== repeats) {
      setRepeats(nextRepeats)
      return // el re-render dispara una nueva medición con la pista completa
    }
    const duration = cycleDuration(contentSize, gap, repeats, speed)
    if (duration > 0) track.style.setProperty('--aui-marquee-duration', `${duration}s`)
  }, [size.width, size.height, gap, speed, vertical, isStatic, repeats])

  // Modo scrollVelocity: deriva la velocidad del scroll en el callback del
  // driver (coalescido por RAF, sin listeners nuevos) y la aplica como
  // `playbackRate` + CSS var de skew. Suscripción solo con la prop activa.
  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!scrollVelocity || isStatic || !root || !track) return

    let lastY: number | null = null
    let resetTimer: ReturnType<typeof setTimeout> | undefined
    const apply = (boost: number, skew: number) => {
      root.style.setProperty('--aui-marquee-boost', String(boost))
      root.style.setProperty('--aui-marquee-skew', `${skew}deg`)
      if (typeof track.getAnimations === 'function') {
        for (const animation of track.getAnimations()) animation.playbackRate = boost
      }
    }

    const unsubscribe = subscribeScroll(() => {
      const y = window.scrollY
      const delta = lastY === null ? 0 : y - lastY
      lastY = y
      const boost = Math.min(MAX_BOOST, 1 + Math.abs(delta) / 40)
      const skew = Math.max(-MAX_SKEW, Math.min(MAX_SKEW, delta * 0.15))
      apply(boost, skew)
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => apply(1, 0), VELOCITY_RESET_MS)
    })
    return () => {
      clearTimeout(resetTimer)
      unsubscribe()
      apply(1, 0)
    }
  }, [scrollVelocity, isStatic])

  // Reduced motion: una sola pasada, sin duplicados desbordantes. Animado:
  // dos mitades idénticas de `repeats` grupos (las copias, aria-hidden).
  const totalGroups = isStatic ? 1 : repeats * 2

  return (
    <div
      ref={rootRef}
      className={`aui-marquee${className ? ` ${className}` : ''}`}
      data-aui-vertical={vertical ? '' : undefined}
      data-aui-reverse={reverse ? '' : undefined}
      data-aui-pause={pauseOnHover ? '' : undefined}
      data-aui-fade={fadeEdges ? '' : undefined}
      data-aui-static={isStatic ? '' : undefined}
      style={{ '--aui-marquee-gap': `${gap}px`, ...style } as CSSProperties}
      {...rest}
    >
      <div ref={trackRef} className="aui-marquee-track">
        {Array.from({ length: totalGroups }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? groupRef : undefined}
            className="aui-marquee-group"
            aria-hidden={i > 0 ? true : undefined}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
