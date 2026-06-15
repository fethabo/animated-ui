'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { pointAtDistance, polylineLength } from '../../utils/polyline-pulse'
import {
  clampDistance,
  createIdleWatcher,
  resolveTargetElement,
  vectorTo,
  type Point,
} from '../../utils/idle-target'
import type { AttentionCueProps } from './types'

export type { AttentionCueProps, CueHead, CueMarker } from './types'

const CSS = `
.aui-attention-cue {
  position: relative;
  width: 100%;
  height: 100%;
}
.aui-attention-cue > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.aui-attention-cue > .aui-cue-content {
  position: relative;
}
`

/** Duración del fade in/out global (al activarse/moverse) en segundos. */
const FADE = 0.25
/** Direcciones del modo ambient (radial). */
const AMBIENT_DIRS = 8
/** Muestras de la estela del cometa. */
const TRAIL_SAMPLES = 12
const TRAIL_LENGTH = 30
/** Segmentos al muestrear un trazo curvo. */
const CURVE_SEGMENTS = 18

interface Ray {
  path: Point[]
  length: number
  /** Ángulo de la tangente en el extremo (para orientar la punta). */
  endAngle: number
}

interface CueState {
  active: boolean
  alpha: number
  rays: Ray[]
  sweep: number
  holding: boolean
  holdElapsed: number
}

/**
 * Construye el trazo desde `origin` hacia `angle`×`len`. Recto si `curve` es 0.
 * Si curva, usa una **bezier cúbica** cuyo segundo control está alineado con la
 * recta origin→destino: así el trazo se arquea en el medio pero **llega
 * apuntando exactamente al destino** (la punta siempre mira al ref).
 */
function buildPath(origin: Point, angle: number, len: number, curve: number, sign: number): Point[] {
  const ux = Math.cos(angle)
  const uy = Math.sin(angle)
  const end: Point = { x: origin.x + ux * len, y: origin.y + uy * len }
  if (curve <= 0) return [origin, end]
  const px = Math.cos(angle + Math.PI / 2)
  const py = Math.sin(angle + Math.PI / 2)
  const offset = curve * len * 0.5 * sign
  // C1 arquea cerca del inicio; C2 sobre el eje recto ⇒ tangente final = al destino.
  const c1 = { x: origin.x + ux * len * 0.33 + px * offset, y: origin.y + uy * len * 0.33 + py * offset }
  const c2 = { x: end.x - ux * len * 0.33, y: end.y - uy * len * 0.33 }
  const pts: Point[] = []
  for (let i = 0; i <= CURVE_SEGMENTS; i++) {
    const t = i / CURVE_SEGMENTS
    const u = 1 - t
    pts.push({
      x: u * u * u * origin.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * end.x,
      y: u * u * u * origin.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * end.y,
    })
  }
  return pts
}

function makeRay(path: Point[]): Ray {
  const a = path[path.length - 2]
  const b = path[path.length - 1]
  return { path, length: polylineLength(path), endAngle: Math.atan2(b.y - a.y, b.x - a.x) }
}

/**
 * Director de atención simple. Tras `idleDelay` ms sin mover el puntero, dispara
 * un **destello de luz** que viaja desde el cursor hacia un `target` (modo
 * directed, con una punta configurable) o irradiando alrededor (ambient, sin
 * `target`). Por default se muestra solo la luz (cometa con glow que aparece y
 * se desvanece); `showGuide` agrega una línea-guía tenue. El trazo puede
 * curvarse (`curve`) y la punta cambiarse (`head`).
 *
 * El overlay tiene `pointer-events: none`: los clicks pasan al contenido. Con
 * `prefers-reduced-motion` el cue (autónomo) no se dibuja.
 */
export function AttentionCue({
  target,
  idleDelay = 2000,
  color = '#fbbf24',
  duration = 700,
  speed = 420,
  maxDistance = 220,
  lineWidth = 3,
  head = 'arrow',
  marker = 'beam',
  curve = 0,
  showGuide = false,
  respectReducedMotion = true,
  className,
  style,
  children,
  ...rest
}: AttentionCueProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<CueState>({
    active: false,
    alpha: 0,
    rays: [],
    sweep: 0,
    holding: false,
    holdElapsed: 0,
  })

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(containerRef)
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('attention-cue'), CSS)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || isStatic) return
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
    const effColor = computed.getPropertyValue('--aui-cue-color').trim() || color
    const effLineWidth = parseFloat(computed.getPropertyValue('--aui-cue-line-width')) || lineWidth
    const effSpeed = parseFloat(computed.getPropertyValue('--aui-cue-speed')) || speed
    const effMaxDistance = parseFloat(computed.getPropertyValue('--aui-cue-max-distance')) || maxDistance
    const effDuration = parseFloat(computed.getPropertyValue('--aui-cue-duration')) || duration
    const curveVar = parseFloat(computed.getPropertyValue('--aui-cue-curve'))
    const effCurve = Number.isNaN(curveVar) ? curve : curveVar

    const state = stateRef.current

    const cleanupWatcher = createIdleWatcher({
      element: container,
      idleDelay,
      onIdle: (cursor) => {
        state.sweep = 0
        state.holding = false
        state.holdElapsed = 0
        const el = resolveTargetElement(target)
        if (el) {
          const cRect = container.getBoundingClientRect()
          const tRect = el.getBoundingClientRect()
          const v = vectorTo(cursor, {
            left: tRect.left - cRect.left,
            top: tRect.top - cRect.top,
            width: tRect.width,
            height: tRect.height,
          })
          const len = clampDistance(v.distance, effMaxDistance)
          state.rays = [makeRay(buildPath(cursor, v.angle, len, effCurve, 1))]
        } else {
          const len = clampDistance(effMaxDistance * 0.6, effMaxDistance)
          state.rays = Array.from({ length: AMBIENT_DIRS }, (_, i) =>
            makeRay(buildPath(cursor, (i / AMBIENT_DIRS) * Math.PI * 2, len, effCurve, i % 2 ? 1 : -1)),
          )
        }
        state.active = true
      },
      onActive: () => {
        state.active = false
      },
    })

    const drawHead = (ray: Ray, alpha: number) => {
      if (head === 'none') return
      const tip = ray.path[ray.path.length - 1]
      ctx.globalAlpha = alpha
      if (head === 'dot') {
        ctx.beginPath()
        ctx.arc(tip.x, tip.y, effLineWidth * 1.6, 0, Math.PI * 2)
        ctx.fill()
        return
      }
      // arrow
      const a = 0.5
      const s = effLineWidth * 4
      ctx.beginPath()
      ctx.moveTo(tip.x, tip.y)
      ctx.lineTo(tip.x - Math.cos(ray.endAngle - a) * s, tip.y - Math.sin(ray.endAngle - a) * s)
      ctx.lineTo(tip.x - Math.cos(ray.endAngle + a) * s, tip.y - Math.sin(ray.endAngle + a) * s)
      ctx.closePath()
      ctx.fill()
    }

    // Espaciado y forma de las huellas (modo `footprints`).
    const footSpacing = effLineWidth * 8
    const drawFoot = (x: number, y: number, angle: number) => {
      const w = effLineWidth
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle) // +x local = sentido de avance (hacia el destino)
      // Suela (adelante, hacia el destino).
      ctx.beginPath()
      ctx.ellipse(0, 0, w * 2, w * 1.1, 0, 0, Math.PI * 2)
      ctx.fill()
      // Talón (atrás): el dedito va detrás, así la huella "avanza" al destino.
      ctx.beginPath()
      ctx.ellipse(-w * 2.4, 0, w * 0.8, w * 0.7, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawRay = (ray: Ray, flash: number) => {
      const a = state.alpha * flash
      // Guía tenue opcional (todo el recorrido).
      if (showGuide) {
        ctx.globalAlpha = state.alpha * 0.16
        ctx.beginPath()
        ctx.moveTo(ray.path[0].x, ray.path[0].y)
        for (let i = 1; i < ray.path.length; i++) ctx.lineTo(ray.path[i].x, ray.path[i].y)
        ctx.stroke()
      }

      const d = Math.min(state.sweep, ray.length)
      ctx.shadowColor = effColor
      ctx.shadowBlur = effLineWidth * 4

      if (marker === 'footprints') {
        // Huellas que avanzan hasta donde llegó el barrido, alternando lados;
        // las más nuevas (cerca de la cabeza) brillan más.
        const count = Math.floor(ray.length / footSpacing)
        for (let i = 1; i <= count; i++) {
          const fd = i * footSpacing
          if (fd > d) break
          const p = pointAtDistance(ray.path, fd)
          const ahead = pointAtDistance(ray.path, Math.min(fd + 1, ray.length))
          const ang = Math.atan2(ahead.y - p.y, ahead.x - p.x)
          const side = i % 2 ? 1 : -1
          const off = effLineWidth * 1.5
          const recency = 1 - (d - fd) / Math.max(1, ray.length)
          ctx.globalAlpha = a * (0.35 + 0.65 * recency)
          drawFoot(p.x + Math.cos(ang + Math.PI / 2) * off * side, p.y + Math.sin(ang + Math.PI / 2) * off * side, ang)
        }
      } else {
        // Cometa de luz: cabeza con glow + estela que decae (solo la luz).
        for (let k = TRAIL_SAMPLES; k >= 0; k--) {
          const dd = d - (k / TRAIL_SAMPLES) * TRAIL_LENGTH
          if (dd < 0) continue
          const fade = 1 - k / TRAIL_SAMPLES
          const p = pointAtDistance(ray.path, dd)
          ctx.globalAlpha = a * fade * fade
          ctx.beginPath()
          ctx.arc(p.x, p.y, effLineWidth * (0.5 + fade * 0.6), 0, Math.PI * 2)
          ctx.fill()
        }
      }
      // Punta: aparece cuando el cue llega al extremo.
      const arrival = ray.length > 0 ? Math.min(1, state.sweep / ray.length) : 1
      drawHead(ray, a * arrival)
      ctx.shadowBlur = 0
    }

    let rafId = 0
    let last = 0
    const loop = (ts: number) => {
      const dt = last === 0 ? 0 : (ts - last) / 1000
      last = ts

      state.alpha = state.active
        ? Math.min(1, state.alpha + dt / FADE)
        : Math.max(0, state.alpha - dt / FADE)

      ctx.clearRect(0, 0, width, height)
      if (state.alpha > 0 && state.rays.length > 0) {
        const maxLen = Math.max(...state.rays.map((r) => r.length), 1)
        // Envolvente del destello: brilla mientras barre, se apaga al sostener,
        // y reaparece (aparece y desaparece como un flash).
        let flash = 1
        if (state.holding) {
          state.holdElapsed += dt * 1000
          flash = Math.max(0, 1 - state.holdElapsed / effDuration)
          if (state.holdElapsed >= effDuration) {
            state.holding = false
            state.sweep = 0
          }
        } else {
          state.sweep += effSpeed * dt
          if (state.sweep >= maxLen) {
            state.sweep = maxLen
            state.holding = true
            state.holdElapsed = 0
          }
        }
        ctx.strokeStyle = effColor
        ctx.fillStyle = effColor
        ctx.lineWidth = effLineWidth
        ctx.lineCap = 'round'
        for (const ray of state.rays) drawRay(ray, flash)
        ctx.globalAlpha = 1
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafId)
      cleanupWatcher()
    }
  }, [
    size.width,
    size.height,
    target,
    idleDelay,
    color,
    duration,
    speed,
    maxDistance,
    lineWidth,
    head,
    marker,
    curve,
    showGuide,
    isStatic,
  ])

  return (
    <div
      ref={containerRef}
      className={`aui-attention-cue${className ? ` ${className}` : ''}`}
      style={
        {
          '--aui-cue-color': color,
          '--aui-cue-duration': `${duration}`,
          '--aui-cue-speed': `${speed}`,
          '--aui-cue-max-distance': `${maxDistance}`,
          '--aui-cue-line-width': `${lineWidth}px`,
          '--aui-cue-curve': `${curve}`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      {children != null && <div className="aui-cue-content">{children}</div>}
    </div>
  )
}
