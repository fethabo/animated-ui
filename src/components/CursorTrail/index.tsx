'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { createPrng } from '../../utils/prng'
import {
  advanceEmitter,
  ageLinePoints,
  createEmitterState,
  lineSegments,
  resetEmitter,
  spawnParticle,
  stepTrailParticles,
  type LinePoint,
  type TrailParticle,
} from './physics'
import type { CursorTrailProps } from './types'

export type { CursorTrailMode, CursorTrailProps } from './types'

const CSS = `
.aui-cursor-trail {
  position: relative;
}
.aui-cursor-trail > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
`

/** Tope de `dt` en segundos: una pestaña en background no teletransporta la estela. */
const MAX_DT = 0.05

/**
 * Estela que sigue al puntero dentro de su contenedor, sobre un canvas overlay
 * `pointer-events: none` (los children siguen interactivos). Dos modos:
 * `particles` (pool con vida/fade/deriva) y `line` (polyline con grosor y
 * alpha decrecientes hacia la cola). La emisión se throttlea por distancia
 * recorrida (`emitEvery` px) y el RAF corre solo mientras hay estela viva:
 * con el puntero quieto y la estela desvanecida, no hay trabajo por frame.
 *
 * Con `prefers-reduced-motion` el efecto se desactiva por completo (sin
 * listeners, dibujo ni RAF): la estela es decoración de movimiento, no
 * feedback funcional.
 */
export function CursorTrail({
  mode = 'particles',
  color = '#7c3aed',
  colors,
  size = 8,
  life = 0.6,
  length = 36,
  emitEvery = 12,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: CursorTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 })

  const reducedMotion = useReducedMotion()
  const containerSize = useResizeObserver(containerRef)
  const disabled = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('cursor-trail'), CSS)
  }, [])

  // Backing store del canvas con devicePixelRatio (patrón ParticleField).
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || containerSize.width <= 0 || containerSize.height <= 0) return
    sizeRef.current = { width: containerSize.width, height: containerSize.height }
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = Math.max(1, Math.round(containerSize.width * dpr))
    canvas.height = Math.max(1, Math.round(containerSize.height * dpr))
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [containerSize.width, containerSize.height])

  // Tracking + emisión + loop. Bajo reduced motion no se registra nada.
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas || disabled) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (sizeRef.current.width === 0) {
      const width = container.clientWidth
      const height = container.clientHeight
      sizeRef.current = { width, height }
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // Estética efectiva: un override CSS (`--aui-cursor-trail-*`) prevalece
    // sobre el default de la prop.
    const computed = getComputedStyle(container)
    const effColor = computed.getPropertyValue('--aui-cursor-trail-color').trim() || color
    const effSize = parseFloat(computed.getPropertyValue('--aui-cursor-trail-size')) || size
    const palette = colors && colors.length > 0 ? colors : [effColor]

    const rng = createPrng('cursor-trail')
    const emitter = createEmitterState()
    const particles: TrailParticle[] = []
    const linePoints: LinePoint[] = []

    let rafId = 0
    let running = false
    let lastTs = 0

    const draw = () => {
      const { width, height } = sizeRef.current
      ctx.clearRect(0, 0, width, height)
      if (mode === 'line') {
        ctx.lineCap = 'round'
        ctx.strokeStyle = palette[0]
        for (const s of lineSegments(linePoints, effSize, life)) {
          ctx.globalAlpha = s.alpha
          ctx.lineWidth = s.width
          ctx.beginPath()
          ctx.moveTo(s.x1, s.y1)
          ctx.lineTo(s.x2, s.y2)
          ctx.stroke()
        }
      } else {
        for (const p of particles) {
          ctx.globalAlpha = p.life / p.maxLife
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (ts: number) => {
      const dt = lastTs === 0 ? 0 : Math.min(MAX_DT, (ts - lastTs) / 1000)
      lastTs = ts
      stepTrailParticles(particles, dt)
      ageLinePoints(linePoints, dt, life)
      // Sin estela viva, el loop se apaga solo (RAF activo solo con partículas).
      if (particles.length === 0 && linePoints.length === 0) {
        ctx.clearRect(0, 0, sizeRef.current.width, sizeRef.current.height)
        running = false
        return
      }
      draw()
      rafId = requestAnimationFrame(loop)
    }

    const ensureLoop = () => {
      if (running) return
      running = true
      lastTs = 0
      rafId = requestAnimationFrame(loop)
    }

    const onMove = (event: PointerEvent) => {
      // Touch no tiene puntero persistente: el trail degrada a no-op.
      if (event.pointerType === 'touch') return
      const rect = container.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const emitted = advanceEmitter(emitter, x, y, emitEvery)
      if (emitted.length === 0) return
      if (mode === 'line') {
        for (const point of emitted) {
          linePoints.push({ x: point.x, y: point.y, age: 0 })
        }
        if (linePoints.length > length) linePoints.splice(0, linePoints.length - length)
      } else {
        for (const point of emitted) {
          particles.push(
            spawnParticle({ x: point.x, y: point.y, size: effSize, life, colors: palette, random: rng }),
          )
        }
      }
      ensureLoop()
    }
    const onLeave = () => resetEmitter(emitter)

    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerleave', onLeave)
    return () => {
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [mode, color, colors, size, life, length, emitEvery, disabled])

  return (
    <div
      ref={containerRef}
      className={`aui-cursor-trail${className ? ` ${className}` : ''}`}
      style={
        {
          '--aui-cursor-trail-color': color,
          '--aui-cursor-trail-size': `${size}px`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
