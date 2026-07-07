'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver, type ElementSize } from '../../hooks/useResizeObserver'
import { createNoise2D, fbm } from '../../utils/noise'
import { marchingSquares, sampleGrid } from './marching-squares'
import type { TopographicBackgroundProps } from './types'

export type { TopographicBackgroundProps } from './types'

const CSS = `
.aui-topographic-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-topographic-background > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

/** Lado de la celda de muestreo en px (grilla del marching squares, no por pixel). */
const CELL_SIZE = 24
/** Frames del RAF entre recálculos de la capa offscreen (evolución lenta). */
const RECALC_FRAMES = 8
/** Avance del tiempo del campo por recálculo con `speed=1`. */
const TIME_STEP = 0.016
/** Rango efectivo del fBm donde se distribuyen los niveles de contorno. */
const FIELD_RANGE = 0.8
/** Octavas del fBm: detalle fractal del terreno. */
const OCTAVES = 3
/** Debounce del recálculo por resize en ms. */
const RESIZE_DEBOUNCE = 150

/**
 * Curvas de nivel animadas (mapa topográfico vivo) sobre `<canvas>`: el
 * terreno es un campo fBm (ruido simplex fractal) muestreado sobre una grilla
 * de celdas (~24 px, nunca por pixel) del que se extraen `levels` isolíneas
 * con marching squares (módulo puro). Las curvas se dibujan sobre una capa
 * **offscreen** que se recalcula a intervalos espaciados — nunca en cada
 * frame del RAF — y se blitéa al canvas visible, sin parpadeos.
 *
 * Determinista por `seed`: misma seed + dimensiones ⇒ mismo mapa. Con
 * `speed={0}` o `prefers-reduced-motion` el mapa se dibuja una vez sin RAF.
 * El recálculo por resize se debouncea (~150 ms): sin recálculos por frame
 * durante el arrastre. Se posiciona `absolute, inset: 0` sobre su contenedor
 * `position: relative`.
 */
export function TopographicBackground({
  levels = 10,
  color = '#38bdf8',
  lineWidth = 1,
  scale = 220,
  speed = 1,
  seed = 'aui',
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: TopographicBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Tiempo del terreno: persiste entre re-runs para no saltar ante cambios de props.
  const tRef = useRef(0)
  const measuredRef = useRef(false)

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(containerRef)
  const [debouncedSize, setDebouncedSize] = useState<ElementSize>({ width: 0, height: 0 })
  const isStatic = (respectReducedMotion && reducedMotion) || speed === 0

  useEffect(() => {
    injectStyles(styleId('topographic-background'), CSS)
  }, [])

  // Debounce del resize: la primera medición pasa inmediata (primer paint),
  // las siguientes esperan a que el arrastre termine.
  useEffect(() => {
    if (size.width <= 0 || size.height <= 0) return
    if (!measuredRef.current) {
      measuredRef.current = true
      setDebouncedSize(size)
      return
    }
    const id = setTimeout(() => setDebouncedSize(size), RESIZE_DEBOUNCE)
    return () => clearTimeout(id)
  }, [size.width, size.height])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = debouncedSize.width || container.clientWidth
    const height = debouncedSize.height || container.clientHeight
    if (width <= 0 || height <= 0) return

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Estética efectiva: overrides CSS (`--aui-topo-*`) prevalecen sobre props.
    const computed = getComputedStyle(container)
    const effColor = computed.getPropertyValue('--aui-topo-color').trim() || color
    const effLineWidth =
      parseFloat(computed.getPropertyValue('--aui-topo-line-width')) || lineWidth

    const field = fbm(createNoise2D(seed), OCTAVES)
    const cols = Math.max(1, Math.ceil(width / CELL_SIZE))
    const rows = Math.max(1, Math.ceil(height / CELL_SIZE))
    const cellW = width / cols
    const cellH = height / rows

    // Capa offscreen: el trabajo caro (muestreo + marching squares + stroke)
    // ocurre acá a intervalos; el canvas visible solo blitéa el resultado.
    const offscreen = document.createElement('canvas')
    offscreen.width = canvas.width
    offscreen.height = canvas.height
    const offCtx = offscreen.getContext('2d')
    if (!offCtx) return
    offCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const render = (t: number) => {
      // El tiempo desplaza las coordenadas del campo de forma anisótropa:
      // los contornos se deforman gradualmente, sin saltos.
      const values = sampleGrid(cols, rows, (c, r) =>
        field((c * cellW) / scale + t * 0.21, (r * cellH) / scale + t * 0.13),
      )
      offCtx.clearRect(0, 0, width, height)
      offCtx.strokeStyle = effColor
      offCtx.lineWidth = effLineWidth
      for (let level = 0; level < levels; level++) {
        const threshold = -FIELD_RANGE + (2 * FIELD_RANGE * (level + 0.5)) / levels
        const segments = marchingSquares(values, threshold)
        offCtx.beginPath()
        for (const s of segments) {
          offCtx.moveTo(s.x1 * cellW, s.y1 * cellH)
          offCtx.lineTo(s.x2 * cellW, s.y2 * cellH)
        }
        offCtx.stroke()
      }
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(offscreen, 0, 0, width, height)
    }

    render(tRef.current)

    if (isStatic) return // terreno fijo: sin RAF corriendo

    let rafId = 0
    let frame = 0
    const loop = () => {
      frame++
      // Recalcula solo a intervalos espaciados, nunca cada frame.
      if (frame % RECALC_FRAMES === 0) {
        tRef.current += TIME_STEP * speed
        render(tRef.current)
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [
    debouncedSize.width,
    debouncedSize.height,
    levels,
    color,
    lineWidth,
    scale,
    speed,
    seed,
    isStatic,
  ])

  return (
    <div
      ref={containerRef}
      className={`aui-topographic-background${className ? ` ${className}` : ''}`}
      style={
        {
          '--aui-topo-color': color,
          '--aui-topo-line-width': `${lineWidth}px`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
