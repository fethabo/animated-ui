'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { createParticles, rescaleParticles, stepParticles, type Particle } from './physics'
import type { ParticleFieldProps } from './types'

export type { CursorInteraction, ParticleFieldProps } from './types'

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
 * configurable al cursor. Las partículas se mueven con velocidad aleatoria y
 * rebotan en los bordes; dentro del radio del cursor reciben una fuerza
 * proporcional a la proximidad (cursor-a-partícula, O(N)).
 *
 * El canvas llena el contenedor (dimensionalo via `style`/`className`) y se
 * adapta a su tamaño con `ResizeObserver`. Con `prefers-reduced-motion` el RAF
 * se detiene y el canvas muestra las partículas en su estado inicial estático.
 */
export function ParticleField({
  count = 60,
  speed = 0.4,
  radius = 2,
  color = '#7c3aed',
  cursorInteraction = 'repel',
  cursorRadius = 120,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
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
    if (particlesRef.current.length !== count) {
      particlesRef.current = createParticles({ count, width, height, speed })
    }

    // Color y radio efectivos: leídos de la cascada para que un override
    // CSS (`--aui-particle-color`) prevalezca sobre el default de la prop.
    const computed = getComputedStyle(container)
    const effColor = computed.getPropertyValue('--aui-particle-color').trim() || color
    const effRadius = parseFloat(computed.getPropertyValue('--aui-particle-radius')) || radius

    const draw = () => {
      const { width: w, height: h } = sizeRef.current
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = effColor
      for (const p of particlesRef.current) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, effRadius, 0, Math.PI * 2)
        ctx.fill()
      }
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
      })
      draw()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [count, speed, radius, color, cursorInteraction, cursorRadius, isStatic])

  return (
    <div
      ref={containerRef}
      className={`aui-particle-field${className ? ` ${className}` : ''}`}
      style={
        {
          '--aui-particle-color': color,
          '--aui-particle-radius': `${radius}px`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
