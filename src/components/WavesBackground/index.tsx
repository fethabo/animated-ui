'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { createNoise2D } from '../../utils/noise'
import { computeWaveLines } from './geometry'
import type { WavesBackgroundProps } from './types'

export type { WavesBackgroundProps } from './types'

const CSS = `
.aui-waves-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-waves-background > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

const DEFAULT_COLORS = ['#22d3ee', '#a78bfa']

/** Avance del tiempo del campo por frame con `speed=1` (deriva lenta). */
const TIME_STEP = 0.006

/**
 * Fondo de líneas fluidas que ondulan orgánicamente sobre `<canvas>`: cada
 * línea horizontal se curva con ruido simplex evaluado en `(x, t)` — el
 * tiempo entra como coordenada del campo, así la deriva es continua y sin
 * repetición periódica. El muestreo es espaciado (~8 px por punto, nunca por
 * pixel) y el estado vive en refs (sin re-renders de React por frame).
 *
 * Determinista por `seed`: misma seed + dimensiones ⇒ mismas ondas, sin
 * `Math.random`. Se posiciona `absolute, inset: 0` para cubrir su contenedor
 * `position: relative` y se adapta a resizes (con `devicePixelRatio`). Con
 * `prefers-reduced-motion` las líneas se dibujan curvadas pero inmóviles
 * (frame estático `t=0`), sin RAF corriendo.
 */
export function WavesBackground({
  lines = 24,
  amplitude = 24,
  speed = 1,
  colors = DEFAULT_COLORS,
  lineWidth = 1.5,
  seed = 'aui',
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: WavesBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Tiempo del campo: persiste entre re-runs del efecto para que un cambio de
  // props no haga saltar la ondulación.
  const tRef = useRef(0)

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(containerRef)
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('waves-background'), CSS)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Fallback previo a la primera medición del observer.
    const width = size.width || container.clientWidth
    const height = size.height || container.clientHeight
    if (width <= 0 || height <= 0) return

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Estética efectiva: un override CSS (`--aui-waves-*`) prevalece sobre
    // el default de la prop.
    const computed = getComputedStyle(container)
    const effColors = colors.map(
      (c, i) => computed.getPropertyValue(`--aui-waves-color-${i}`).trim() || c,
    )
    const effLineWidth =
      parseFloat(computed.getPropertyValue('--aui-waves-line-width')) || lineWidth

    const noise = createNoise2D(seed)

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = effLineWidth
      const waveLines = computeWaveLines({
        width,
        height,
        lines,
        amplitude,
        t,
        noise,
        colors: effColors,
      })
      for (const line of waveLines) {
        ctx.strokeStyle = line.color
        ctx.beginPath()
        ctx.moveTo(line.points[0].x, line.points[0].y)
        for (let i = 1; i < line.points.length; i++) {
          ctx.lineTo(line.points[i].x, line.points[i].y)
        }
        ctx.stroke()
      }
    }

    if (isStatic) {
      // Reduced motion: composición curvada pero inmóvil, sin loop.
      draw(0)
      return
    }

    let rafId = 0
    const loop = () => {
      tRef.current += TIME_STEP * speed
      draw(tRef.current)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [size.width, size.height, lines, amplitude, speed, colors, lineWidth, seed, isStatic])

  const colorVars: Record<string, string> = {}
  colors.forEach((c, i) => {
    colorVars[`--aui-waves-color-${i}`] = c
  })

  return (
    <div
      ref={containerRef}
      className={`aui-waves-background${className ? ` ${className}` : ''}`}
      style={
        {
          ...colorVars,
          '--aui-waves-line-width': `${lineWidth}px`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
