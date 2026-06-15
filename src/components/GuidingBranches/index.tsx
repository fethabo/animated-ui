'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { createPrng } from '../../utils/prng'
import { polylineLength } from '../../utils/polyline-pulse'
import { createIdleWatcher, resolveTargetElement, vectorTo, type Point } from '../../utils/idle-target'
import { aesthetics } from './aesthetics'
import type { Branch } from './aesthetics'
import type { GuidingBranchesProps } from './types'

export type { AestheticName, GuidingBranchesProps } from './types'

const CSS = `
.aui-guiding-branches {
  position: relative;
  width: 100%;
  height: 100%;
}
.aui-guiding-branches > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.aui-guiding-branches > .aui-branches-content {
  position: relative;
}
`

/** Duración del fade in/out de las ramas en segundos. */
const FADE = 0.3

interface GrownBranch extends Branch {
  length: number
}

interface BranchesState {
  active: boolean
  alpha: number
  branches: GrownBranch[]
  maxExtent: number
  grown: number
  holding: boolean
  holdElapsed: number
  generation: number
}

/** Dibuja una polilínea hasta una distancia de arco `length` desde su inicio. */
function strokePartial(ctx: CanvasRenderingContext2D, points: Point[], length: number) {
  if (points.length < 2 || length <= 0) return
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  let remaining = length
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const segLen = Math.hypot(b.x - a.x, b.y - a.y)
    if (segLen === 0) continue
    if (remaining >= segLen) {
      ctx.lineTo(b.x, b.y)
      remaining -= segLen
    } else {
      const t = remaining / segLen
      ctx.lineTo(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
      break
    }
  }
  ctx.stroke()
}

/**
 * Ramas orgánicas generativas que crecen desde el puntero tras `idleDelay` ms
 * de inactividad. En modo ambient (sin `target`) crecen en todas direcciones;
 * en directed (con `target`) la rama dominante se sesga hacia el elemento,
 * mostrando el camino. La estética es enchufable vía `aesthetic` (`roots`
 * default, `lightning`, …). Cualquier movimiento las retrae y reinicia el
 * temporizador.
 *
 * El overlay tiene `pointer-events: none`: el `target` sigue clickeable. La
 * aleatoriedad viene del PRNG seedable. Con `prefers-reduced-motion` las ramas
 * (autónomas, por temporizador) no se dibujan.
 */
export function GuidingBranches({
  target,
  aesthetic = 'roots',
  idleDelay = 2000,
  color = '#34d399',
  loop = false,
  duration = 1400,
  speed = 320,
  maxDistance = 260,
  density = 4,
  depth = 3,
  lineWidth = 2,
  jitter = 0,
  curl = 0.6,
  respectReducedMotion = true,
  className,
  style,
  children,
  ...rest
}: GuidingBranchesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<BranchesState>({
    active: false,
    alpha: 0,
    branches: [],
    maxExtent: 0,
    grown: 0,
    holding: false,
    holdElapsed: 0,
    generation: 0,
  })

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(containerRef)
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('guiding-branches'), CSS)
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
    const effColor = computed.getPropertyValue('--aui-branches-color').trim() || color
    const effLineWidth = parseFloat(computed.getPropertyValue('--aui-branches-line-width')) || lineWidth
    const effSpeed = parseFloat(computed.getPropertyValue('--aui-branches-speed')) || speed
    const effMaxDistance =
      parseFloat(computed.getPropertyValue('--aui-branches-max-distance')) || maxDistance
    const effDuration = parseFloat(computed.getPropertyValue('--aui-branches-duration')) || duration
    const effJitter = parseFloat(computed.getPropertyValue('--aui-branches-jitter')) || jitter
    const curlVar = parseFloat(computed.getPropertyValue('--aui-branches-curl'))
    const effCurl = Number.isNaN(curlVar) ? curl : curlVar

    const module = aesthetics[aesthetic] ?? aesthetics.roots
    const state = stateRef.current

    const cleanupWatcher = createIdleWatcher({
      element: container,
      idleDelay,
      onIdle: (cursor) => {
        // Sesgo hacia el target (directed) o ambient (null).
        let bias: number | null = null
        const el = resolveTargetElement(target)
        if (el) {
          const cRect = container.getBoundingClientRect()
          const tRect = el.getBoundingClientRect()
          bias = vectorTo(cursor, {
            left: tRect.left - cRect.left,
            top: tRect.top - cRect.top,
            width: tRect.width,
            height: tRect.height,
          }).angle
        }
        state.generation += 1
        const rng = createPrng(`branches:${state.generation}`)
        const branches = module.generate(rng, cursor, {
          maxDistance: effMaxDistance,
          density,
          depth,
          jitter: effJitter,
          curl: effCurl,
          bias,
        })
        state.branches = branches.map((b) => ({ ...b, length: polylineLength(b.points) }))
        state.maxExtent = state.branches.reduce((m, b) => Math.max(m, b.delay + b.length), 1)
        state.grown = 0
        state.holding = false
        state.holdElapsed = 0
        state.active = true
      },
      onActive: () => {
        state.active = false // retracción (fade-out)
      },
    })

    let rafId = 0
    let last = 0
    const step = (ts: number) => {
      const dt = last === 0 ? 0 : (ts - last) / 1000
      last = ts

      state.alpha = state.active
        ? Math.min(1, state.alpha + dt / FADE)
        : Math.max(0, state.alpha - dt / FADE)

      ctx.clearRect(0, 0, width, height)
      if (state.alpha > 0 && state.branches.length > 0) {
        // Crecimiento. Con `loop`: al completarse espera `duration` y re-crece.
        // Sin `loop` (default): crece una vez y queda estático hasta moverse.
        if (state.holding) {
          state.holdElapsed += dt * 1000
          if (state.holdElapsed >= effDuration) {
            state.holding = false
            state.grown = 0
          }
        } else {
          state.grown += effSpeed * dt
          if (state.grown >= state.maxExtent) {
            state.grown = state.maxExtent
            if (loop) {
              state.holding = true
              state.holdElapsed = 0
            }
          }
        }

        ctx.strokeStyle = effColor
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.globalAlpha = state.alpha
        for (const branch of state.branches) {
          const visible = state.grown - branch.delay
          if (visible <= 0) continue
          // Afina las ramas finas (taper por profundidad).
          ctx.lineWidth = Math.max(0.5, effLineWidth * (branch.width ?? 1))
          strokePartial(ctx, branch.points, Math.min(visible, branch.length))
        }
        ctx.globalAlpha = 1
      }
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(rafId)
      cleanupWatcher()
    }
  }, [
    size.width,
    size.height,
    target,
    aesthetic,
    idleDelay,
    color,
    loop,
    duration,
    speed,
    maxDistance,
    density,
    depth,
    lineWidth,
    jitter,
    curl,
    isStatic,
  ])

  return (
    <div
      ref={containerRef}
      className={`aui-guiding-branches${className ? ` ${className}` : ''}`}
      style={
        {
          '--aui-branches-color': color,
          '--aui-branches-duration': `${duration}`,
          '--aui-branches-speed': `${speed}`,
          '--aui-branches-max-distance': `${maxDistance}`,
          '--aui-branches-line-width': `${lineWidth}px`,
          '--aui-branches-jitter': `${jitter}`,
          '--aui-branches-curl': `${curl}`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      {children != null && <div className="aui-branches-content">{children}</div>}
    </div>
  )
}
