'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { createPrng, int } from '../../utils/prng'
import { pointAtDistance, polylineLength } from '../../utils/polyline-pulse'
import { routeCircuit } from './router'
import type { CircuitBackgroundProps } from './types'

export type { CircuitBackgroundProps } from './types'

const CSS = `
.aui-circuit-background {
  position: relative;
  width: 100%;
  height: 100%;
}
.aui-circuit-background > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

/** Largo de la estela de cada pulso en px y cantidad de muestras del decaimiento. */
const TRAIL_LENGTH = 30
const TRAIL_SAMPLES = 8

interface Pulse {
  track: number
  /** Distancia de la cabeza desde el inicio de la pista, en px. */
  head: number
}

/**
 * Fondo de circuito estilo PCB sobre `<canvas>`: pistas ortogonales generadas
 * proceduralmente (random walk sobre grilla con pads en uniones/terminaciones)
 * y pulsos de luz que recorren las pistas (cabeza con glow + estela que decae).
 *
 * La generación es **determinista por `seed`**: misma seed + tamaño + densidad
 * ⇒ mismo trazado, estable entre SSR e hidratación. Las pistas/pads se dibujan
 * una sola vez en un canvas offscreen y se componen cada frame; solo los pulsos
 * se recalculan por frame. Con `prefers-reduced-motion` el circuito se muestra
 * dibujado pero los pulsos no se animan.
 */
export function CircuitBackground({
  seed = 'aui',
  density = 1,
  trackColor = '#1e3a5f',
  pulseColor = '#22d3ee',
  pulseSpeed = 90,
  pulseCount = 8,
  lineWidth = 2,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: CircuitBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(containerRef)
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('circuit-background'), CSS)
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

    // Colores/medidas efectivos leídos de la cascada: un override CSS
    // (`--aui-circuit-*`) prevalece sobre el default de la prop.
    const computed = getComputedStyle(container)
    const effTrackColor = computed.getPropertyValue('--aui-circuit-track-color').trim() || trackColor
    const effPulseColor = computed.getPropertyValue('--aui-circuit-pulse-color').trim() || pulseColor
    const effLineWidth = parseFloat(computed.getPropertyValue('--aui-circuit-line-width')) || lineWidth
    const effPulseSpeed = parseFloat(computed.getPropertyValue('--aui-circuit-pulse-speed')) || pulseSpeed

    // Trazado determinista por seed/tamaño/densidad.
    const layout = routeCircuit({ width, height, seed, density })
    const lengths = layout.tracks.map((t) => polylineLength(t))

    // Capa estática (pistas + pads) dibujada una sola vez en offscreen.
    const off = document.createElement('canvas')
    off.width = canvas.width
    off.height = canvas.height
    const offCtx = off.getContext('2d')
    if (offCtx) {
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      offCtx.strokeStyle = effTrackColor
      offCtx.fillStyle = effTrackColor
      offCtx.lineWidth = effLineWidth
      offCtx.lineJoin = 'round'
      offCtx.lineCap = 'round'
      for (const poly of layout.tracks) {
        offCtx.beginPath()
        offCtx.moveTo(poly[0].x, poly[0].y)
        for (let i = 1; i < poly.length; i++) offCtx.lineTo(poly[i].x, poly[i].y)
        offCtx.stroke()
      }
      const padRadius = effLineWidth * 1.7
      for (const pad of layout.pads) {
        offCtx.beginPath()
        offCtx.arc(pad.x, pad.y, padRadius, 0, Math.PI * 2)
        offCtx.fill()
      }
    }

    // Pulsos sembrados de forma determinista sobre pistas con longitud.
    const routable = layout.tracks
      .map((_, i) => i)
      .filter((i) => lengths[i] > 0)
    const pulseRng = createPrng(`${seed}:pulses`)
    const pulses: Pulse[] = []
    if (routable.length > 0) {
      for (let i = 0; i < pulseCount; i++) {
        const track = routable[int(pulseRng, 0, routable.length - 1)]
        pulses.push({ track, head: pulseRng() * lengths[track] })
      }
    }

    const drawPulse = (pulse: Pulse) => {
      const poly = layout.tracks[pulse.track]
      if (!poly) return
      // Estela: muestras hacia atrás con alpha y radio decrecientes.
      for (let k = TRAIL_SAMPLES; k >= 1; k--) {
        const d = pulse.head - (k / TRAIL_SAMPLES) * TRAIL_LENGTH
        if (d < 0) continue
        const p = pointAtDistance(poly, d)
        const fade = 1 - k / TRAIL_SAMPLES
        ctx.globalAlpha = fade * fade
        ctx.beginPath()
        ctx.arc(p.x, p.y, effLineWidth * 0.9, 0, Math.PI * 2)
        ctx.fill()
      }
      // Cabeza con glow.
      const hp = pointAtDistance(poly, pulse.head)
      ctx.globalAlpha = 1
      ctx.shadowBlur = 8
      ctx.shadowColor = effPulseColor
      ctx.beginPath()
      ctx.arc(hp.x, hp.y, effLineWidth * 1.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(off, 0, 0, width, height)
    }

    if (isStatic) {
      drawStatic()
      return
    }

    let rafId = 0
    let last = 0
    const loop = (ts: number) => {
      const dt = last === 0 ? 0 : (ts - last) / 1000
      last = ts

      drawStatic()
      ctx.fillStyle = effPulseColor
      for (const pulse of pulses) {
        pulse.head += effPulseSpeed * dt
        const length = lengths[pulse.track]
        // Reaparece periódicamente: al pasar el final salta a otra pista.
        if (pulse.head - TRAIL_LENGTH > length) {
          pulse.track = routable[int(pulseRng, 0, routable.length - 1)]
          pulse.head = 0
        }
        drawPulse(pulse)
      }
      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [
    size.width,
    size.height,
    seed,
    density,
    trackColor,
    pulseColor,
    pulseSpeed,
    pulseCount,
    lineWidth,
    isStatic,
  ])

  return (
    <div
      ref={containerRef}
      className={`aui-circuit-background${className ? ` ${className}` : ''}`}
      style={
        {
          '--aui-circuit-track-color': trackColor,
          '--aui-circuit-pulse-color': pulseColor,
          '--aui-circuit-pulse-speed': `${pulseSpeed}`,
          '--aui-circuit-line-width': `${lineWidth}px`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
