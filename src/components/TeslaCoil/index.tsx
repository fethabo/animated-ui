'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { createPrng, range } from '../../utils/prng'
import { jaggedBolt, type Point } from '../../utils/jagged-bolt'
import type { TeslaCoilProps } from './types'

export type { CoilOrigin, TeslaCoilProps } from './types'

const CSS = `
.aui-tesla-coil {
  position: relative;
  width: 100%;
  height: 100%;
}
.aui-tesla-coil > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.aui-tesla-coil > .aui-tesla-content {
  position: relative;
}
`

/** Profundidad de subdivisión de cada rayo. */
const BOLT_DETAIL = 4

/**
 * Bobina de Tesla sobre `<canvas>`: un nodo central del que emanan rayos
 * (arcos eléctricos jagged) hacia afuera en todas direcciones, regenerándose
 * para dar sensación de descarga continua. Con `followCursor` activo y el
 * cursor sobre el contenedor, dirige además un rayo hacia el puntero (tracking
 * por ref, sin re-render por frame). El trazo jagged usa el PRNG seedable.
 *
 * El canvas tiene `pointer-events: none`: los `children` superpuestos siguen
 * siendo interactivos. Con `prefers-reduced-motion` los rayos ambientales se
 * dibujan una vez sin regenerarse.
 */
export function TeslaCoil({
  color = '#7dd3fc',
  boltCount = 7,
  lineWidth = 2,
  frequency = 12,
  reach = 160,
  jitter = 18,
  followCursor = true,
  cursorBolts = 3,
  cursorTrigger = 'hover',
  origin = { x: 0.5, y: 0.5 },
  respectReducedMotion = true,
  className,
  style,
  children,
  ...rest
}: TeslaCoilProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<Point | null>(null)
  const pressedRef = useRef(false)

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(containerRef)
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('tesla-coil'), CSS)
  }, [])

  // Tracking del cursor por ref (sin re-render). Touch se ignora: un dedo no es
  // un cursor de hover, la bobina sigue solo con rayos ambientales.
  useEffect(() => {
    const container = containerRef.current
    if (!container || !followCursor) return
    const setCursor = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      cursorRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      setCursor(event)
    }
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      setCursor(event)
      pressedRef.current = true
    }
    const onUp = () => {
      pressedRef.current = false
    }
    const onLeave = () => {
      cursorRef.current = null
      pressedRef.current = false
    }
    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerdown', onDown)
    container.addEventListener('pointerup', onUp)
    container.addEventListener('pointercancel', onUp)
    container.addEventListener('pointerleave', onLeave)
    return () => {
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerdown', onDown)
      container.removeEventListener('pointerup', onUp)
      container.removeEventListener('pointercancel', onUp)
      container.removeEventListener('pointerleave', onLeave)
    }
  }, [followCursor])

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

    const computed = getComputedStyle(container)
    const effColor = computed.getPropertyValue('--aui-tesla-color').trim() || color
    const effLineWidth = parseFloat(computed.getPropertyValue('--aui-tesla-line-width')) || lineWidth
    const effReach = parseFloat(computed.getPropertyValue('--aui-tesla-reach')) || reach
    const effJitter = parseFloat(computed.getPropertyValue('--aui-tesla-jitter')) || jitter
    const effFrequency = parseFloat(computed.getPropertyValue('--aui-tesla-frequency')) || frequency

    const center: Point = { x: width * origin.x, y: height * origin.y }
    const rng = createPrng('tesla-coil')

    // Rayos ambientales: ángulos repartidos con longitud/ángulo jitterados.
    const generateAmbient = (): Point[][] => {
      const bolts: Point[][] = []
      for (let i = 0; i < boltCount; i++) {
        const angle = (i / boltCount) * Math.PI * 2 + range(rng, -0.35, 0.35)
        const len = effReach * range(rng, 0.6, 1)
        const tip: Point = { x: center.x + Math.cos(angle) * len, y: center.y + Math.sin(angle) * len }
        bolts.push(jaggedBolt(rng, center, tip, { jitter: effJitter, detail: BOLT_DETAIL }))
      }
      return bolts
    }

    // Rayos dirigidos al cursor: todos del centro al MISMO punto (el cursor),
    // pero con trazos jagged distintos (regenerados por frame) ⇒ divergen en el
    // medio y convergen en el cursor, como una mano que atrae el arco. Se
    // dibujan más fuertes que los ambientales.
    const generateCursor = (cursor: Point): Point[][] => {
      const bolts: Point[][] = []
      for (let i = 0; i < cursorBolts; i++) {
        bolts.push(jaggedBolt(rng, center, cursor, { jitter: effJitter, detail: BOLT_DETAIL }))
      }
      return bolts
    }

    const strokeBolts = (bolts: Point[][], width: number, glow: number, core: boolean) => {
      ctx.strokeStyle = effColor
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.shadowColor = effColor
      ctx.shadowBlur = glow
      ctx.lineWidth = width
      for (const bolt of bolts) {
        ctx.beginPath()
        ctx.moveTo(bolt[0].x, bolt[0].y)
        for (let i = 1; i < bolt.length; i++) ctx.lineTo(bolt[i].x, bolt[i].y)
        ctx.stroke()
      }
      // Núcleo blanco caliente para los rayos al cursor (más intensos).
      if (core) {
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.shadowBlur = glow * 0.5
        ctx.lineWidth = Math.max(1, width * 0.4)
        for (const bolt of bolts) {
          ctx.beginPath()
          ctx.moveTo(bolt[0].x, bolt[0].y)
          for (let i = 1; i < bolt.length; i++) ctx.lineTo(bolt[i].x, bolt[i].y)
          ctx.stroke()
        }
      }
      ctx.shadowBlur = 0
    }

    const draw = (ambient: Point[][]) => {
      ctx.clearRect(0, 0, width, height)
      // Ambientales algo más tenues para que el rayo al cursor resalte.
      ctx.globalAlpha = 0.8
      strokeBolts(ambient, effLineWidth, 10, false)
      ctx.globalAlpha = 1
      // Con `cursorTrigger: 'click'` los rayos al cursor solo salen mientras se
      // mantiene presionado; con `'hover'`, siempre que el cursor esté encima.
      const cursor = cursorRef.current
      const showCursor = cursor && (cursorTrigger === 'hover' || pressedRef.current)
      if (showCursor) strokeBolts(generateCursor(cursor), effLineWidth * 1.9, 22, true)
    }

    if (isStatic) {
      draw(generateAmbient())
      return
    }

    const interval = effFrequency > 0 ? 1000 / effFrequency : 1000
    let ambient = generateAmbient()
    let lastRegen = 0
    let rafId = 0
    const loop = (ts: number) => {
      if (lastRegen === 0) lastRegen = ts
      // Ambientales se regeneran a la frecuencia pedida; los del cursor se
      // regeneran cada frame dentro de `draw` para seguir al puntero.
      if (ts - lastRegen >= interval) {
        ambient = generateAmbient()
        lastRegen = ts
      }
      draw(ambient)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [
    size.width,
    size.height,
    color,
    boltCount,
    lineWidth,
    frequency,
    reach,
    jitter,
    cursorBolts,
    cursorTrigger,
    origin.x,
    origin.y,
    followCursor,
    isStatic,
  ])

  return (
    <div
      ref={containerRef}
      className={`aui-tesla-coil${className ? ` ${className}` : ''}`}
      style={
        {
          '--aui-tesla-color': color,
          '--aui-tesla-line-width': `${lineWidth}px`,
          '--aui-tesla-reach': `${reach}`,
          '--aui-tesla-jitter': `${jitter}`,
          '--aui-tesla-frequency': `${frequency}`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      {children != null && <div className="aui-tesla-content">{children}</div>}
    </div>
  )
}
