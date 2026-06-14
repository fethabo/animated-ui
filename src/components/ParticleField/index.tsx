'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { createParticles, rescaleParticles, stepParticles, type Particle } from './physics'
import { computeLinks } from './links'
import type { ParticleFieldProps } from './types'

export type { CursorInteraction, DriftMode, ParticleFieldProps } from './types'

const CSS = `
.aui-particle-field {
  position: relative;
  width: 100%;
  height: 100%;
}
.aui-particle-field > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

/**
 * Campo de partículas autónomas sobre `<canvas>`, con repulsión/atracción
 * configurable al cursor. Por default las partículas se mueven con velocidad
 * aleatoria y rebotan en los bordes; dentro del radio del cursor reciben una
 * fuerza proporcional a la proximidad (cursor-a-partícula, O(N)).
 *
 * `drift` cambia el carácter del movimiento (`snow`/`embers`/`bubbles`, con
 * wrap por el borde opuesto). `links` activa el efecto constellation —líneas
 * entre partículas cercanas y, opcionalmente, al cursor— con un costo O(N²)
 * **opt-in** (apagado por default para preservar el costo O(N)).
 *
 * El canvas llena el contenedor (dimensionalo via `style`/`className`) y se
 * adapta a su tamaño con `ResizeObserver`. Con `prefers-reduced-motion` el RAF
 * se detiene y el canvas muestra las partículas (y las líneas, si `links` está
 * activo) en su estado inicial estático, dibujadas una sola vez.
 */
export function ParticleField({
  count = 60,
  speed = 0.4,
  radius = 2,
  color = '#7c3aed',
  cursorInteraction = 'repel',
  cursorRadius = 120,
  drift = 'bounce',
  links = false,
  linkDistance = 120,
  linkColor,
  linkWidth = 1,
  linkCursor = true,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const driftRef = useRef<typeof drift | null>(null)
  const cursorRef = useRef<{ x: number; y: number } | null>(null)
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 })

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(containerRef)
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('particle-field'), CSS)
  }, [])

  // Cursor tracking via ref (sin re-render por frame). Touch-only se ignora:
  // un dedo no es un cursor de hover, las partículas siguen autónomas.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = container.getBoundingClientRect()
      cursorRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const onLeave = () => {
      cursorRef.current = null
    }
    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerleave', onLeave)
    return () => {
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // Redimensionado: ajusta el backing store del canvas (con devicePixelRatio)
  // y reescala las partículas proporcionalmente para que no salten.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || size.width <= 0 || size.height <= 0) return
    const prev = sizeRef.current
    rescaleParticles(particlesRef.current, prev.width, prev.height, size.width, size.height)
    sizeRef.current = { width: size.width, height: size.height }
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = Math.max(1, Math.round(size.width * dpr))
    canvas.height = Math.max(1, Math.round(size.height * dpr))
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [size.width, size.height])

  // Loop de animación. Reduced motion → dibuja un único frame estático.
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = sizeRef.current.width || container.clientWidth
    const height = sizeRef.current.height || container.clientHeight
    if (sizeRef.current.width === 0) {
      sizeRef.current = { width, height }
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    // Recrea el array si cambió la cantidad o el modo de deriva (la
    // inicialización de velocidad/vida depende del `drift`).
    if (particlesRef.current.length !== count || driftRef.current !== drift) {
      particlesRef.current = createParticles({ count, width, height, speed, drift })
      driftRef.current = drift
    }

    // Color, radio y estilo de líneas efectivos: leídos de la cascada para que
    // un override CSS (`--aui-particle-*`) prevalezca sobre el default de la prop.
    const computed = getComputedStyle(container)
    const effColor = computed.getPropertyValue('--aui-particle-color').trim() || color
    const effRadius = parseFloat(computed.getPropertyValue('--aui-particle-radius')) || radius
    const effLinkColor =
      computed.getPropertyValue('--aui-particle-link-color').trim() || linkColor || effColor
    const effLinkWidth = parseFloat(computed.getPropertyValue('--aui-particle-link-width')) || linkWidth
    const effLinkDistance =
      parseFloat(computed.getPropertyValue('--aui-particle-link-distance')) || linkDistance

    const draw = () => {
      const { width: w, height: h } = sizeRef.current
      ctx.clearRect(0, 0, w, h)

      // Líneas de conexión detrás de las partículas (solo si `links` está activo;
      // este es el único cálculo O(N²) y permanece apagado por default).
      if (links) {
        const segments = computeLinks(particlesRef.current, {
          linkDistance: effLinkDistance,
          cursor: linkCursor ? cursorRef.current : null,
        })
        ctx.strokeStyle = effLinkColor
        ctx.lineWidth = effLinkWidth
        for (const s of segments) {
          ctx.globalAlpha = s.opacity
          ctx.beginPath()
          ctx.moveTo(s.x1, s.y1)
          ctx.lineTo(s.x2, s.y2)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      }

      ctx.fillStyle = effColor
      const fade = drift === 'embers'
      for (const p of particlesRef.current) {
        // En `embers` el alpha por partícula materializa el desvanecimiento.
        if (fade) ctx.globalAlpha = p.life ?? 1
        ctx.beginPath()
        ctx.arc(p.x, p.y, effRadius, 0, Math.PI * 2)
        ctx.fill()
      }
      if (fade) ctx.globalAlpha = 1
    }

    if (isStatic) {
      draw()
      return
    }

    let rafId = 0
    const loop = () => {
      stepParticles(particlesRef.current, {
        width: sizeRef.current.width,
        height: sizeRef.current.height,
        cursor: cursorRef.current,
        cursorRadius,
        cursorInteraction,
        radius: effRadius,
        maxSpeed: speed * 6,
        drift,
        speed,
      })
      draw()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [
    count,
    speed,
    radius,
    color,
    cursorInteraction,
    cursorRadius,
    drift,
    links,
    linkDistance,
    linkColor,
    linkWidth,
    linkCursor,
    isStatic,
  ])

  return (
    <div
      ref={containerRef}
      className={`aui-particle-field${className ? ` ${className}` : ''}`}
      style={
        {
          '--aui-particle-color': color,
          '--aui-particle-radius': `${radius}px`,
          '--aui-particle-link-color': linkColor ?? color,
          '--aui-particle-link-width': `${linkWidth}px`,
          '--aui-particle-link-distance': `${linkDistance}px`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
