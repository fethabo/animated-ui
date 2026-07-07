'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { createNoise2D } from '../../utils/noise'
import { createPrng } from '../../utils/prng'
import { createFlowParticles, stepFlowParticles, type FlowParticle } from './simulation'
import type { FlowFieldProps } from './types'

export type { FlowFieldProps } from './types'

const CSS = `
.aui-flow-field {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-flow-field > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

const DEFAULT_COLORS = ['#22d3ee', '#a78bfa', '#f472b6']

/** Pasos de pre-simulación para la composición estática de reduced motion. */
const STATIC_STEPS = 300

/**
 * Partículas que siguen un campo vectorial de ruido simplex dejando trazos
 * orgánicos sobre `<canvas>`. El ángulo de avance de cada partícula sale del
 * valor del campo en su posición (una muestra de ruido por partícula por
 * frame); la persistencia del trazo se logra pintando por frame un velo
 * semitransparente del color de fondo (`fade`), sin historial de posiciones.
 * Estado en refs — sin re-renders de React por frame.
 *
 * **Pinta su propio fondo** (`background`, no transparente): el velo del fade
 * lo requiere. Determinista por `seed` (posiciones, respawns y campo); misma
 * seed + dimensiones ⇒ misma evolución. Se posiciona `absolute, inset: 0` y
 * se adapta a resizes reiniciando la simulación de forma determinista. Con
 * `prefers-reduced-motion` se dibuja una composición estática de trazos
 * pre-simulados (presupuesto fijo de pasos), sin RAF corriendo.
 */
export function FlowField({
  count = 400,
  speed = 1,
  colors = DEFAULT_COLORS,
  fade = 0.95,
  scale = 200,
  background = '#0a0a12',
  seed = 'aui',
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: FlowFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(containerRef)
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('flow-field'), CSS)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = size.width || container.clientWidth
    const height = size.height || container.clientHeight
    if (width <= 0 || height <= 0) return

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Estética efectiva: overrides CSS (`--aui-flow-*`) prevalecen sobre props.
    const computed = getComputedStyle(container)
    const effColors = colors.map(
      (c, i) => computed.getPropertyValue(`--aui-flow-color-${i}`).trim() || c,
    )
    const effBackground =
      computed.getPropertyValue('--aui-flow-background').trim() || background

    // Simulación determinista: se reinicia de cero ante cualquier cambio de
    // props o resize (misma seed + dimensiones ⇒ misma evolución).
    const noise = createNoise2D(seed)
    const rng = createPrng(`${seed}:particles`)
    const particles: FlowParticle[] = createFlowParticles({
      count,
      width,
      height,
      colors: effColors,
      rng,
    })

    // Fondo inicial opaco (el componente pinta su propio fondo).
    ctx.globalAlpha = 1
    ctx.fillStyle = effBackground
    ctx.fillRect(0, 0, width, height)

    const veilAlpha = Math.min(1, Math.max(0, 1 - fade))
    const stepOptions = { width, height, speed, scale, noise, rng }

    const drawStep = (withVeil: boolean) => {
      if (withVeil && veilAlpha > 0) {
        // Velo semitransparente del fondo: los trazos se desvanecen solos.
        ctx.globalAlpha = veilAlpha
        ctx.fillStyle = effBackground
        ctx.fillRect(0, 0, width, height)
        ctx.globalAlpha = 1
      }
      stepFlowParticles(particles, stepOptions)
      ctx.lineWidth = 1
      for (const p of particles) {
        ctx.strokeStyle = p.color
        ctx.beginPath()
        ctx.moveTo(p.px, p.py)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
    }

    if (isStatic) {
      // Reduced motion: trazos pre-simulados con presupuesto fijo, sin velo
      // (composición estática densa) y sin RAF corriendo.
      for (let i = 0; i < STATIC_STEPS; i++) drawStep(false)
      return
    }

    let rafId = 0
    const loop = () => {
      drawStep(true)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [size.width, size.height, count, speed, colors, fade, scale, background, seed, isStatic])

  const colorVars: Record<string, string> = {}
  colors.forEach((c, i) => {
    colorVars[`--aui-flow-color-${i}`] = c
  })

  return (
    <div
      ref={containerRef}
      className={`aui-flow-field${className ? ` ${className}` : ''}`}
      style={
        {
          ...colorVars,
          '--aui-flow-background': background,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
