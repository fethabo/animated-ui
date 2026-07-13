'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { createPrng } from '../../utils/prng'
import {
  createStarfield,
  spawnShootingStar,
  stepShootingStars,
  type ShootingStar,
} from './starfield'
import type { StarfieldBackgroundProps } from './types'

export type { StarfieldBackgroundProps } from './types'

const CSS = `
.aui-starfield-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-starfield-background > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

const DEFAULT_COLORS = ['#ffffff', '#bfdbfe', '#fde68a']

/** Alpha base de las estrellas en la capa offscreen (piso del titileo). */
const BASE_ALPHA = 0.35
/** Alpha adicional del overlay de titileo (techo = BASE + TWINKLE). */
const TWINKLE_ALPHA = 0.65
/** Frecuencia base del titileo en rad/s a `speed = 1`. */
const TWINKLE_FREQ = 2.2
/** Largo de la cola de una fugaz, en segundos de trayectoria. */
const SHOOTING_TAIL = 0.12

/**
 * Cielo estrellado vivo sobre `<canvas>`: estrellas titilando con fases
 * independientes + fugaces ocasionales. El campo (posiciones, radios, fases,
 * colores) es **determinista por `seed`** y se pinta una sola vez en un canvas
 * offscreen al montar/redimensionar (patrón CircuitBackground); por frame solo
 * se compone el titileo (alpha senoidal por estrella) y las fugaces.
 *
 * Se posiciona `absolute, inset: 0` (o `fixed` para el viewport) y se adapta
 * a resizes regenerando el campo de forma determinista. Con
 * `prefers-reduced-motion` se pinta el campo estático, sin titileo, fugaces
 * ni RAF.
 */
export function StarfieldBackground({
  seed = 'aui',
  density = 1,
  colors = DEFAULT_COLORS,
  background = '#050514',
  speed = 1,
  shootingStars = 8,
  fixed = false,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: StarfieldBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(containerRef)
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('starfield-background'), CSS)
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

    // Estética efectiva: overrides CSS (`--aui-starfield-*`) prevalecen sobre props.
    const computed = getComputedStyle(container)
    const effColors = colors.map(
      (c, i) => computed.getPropertyValue(`--aui-starfield-color-${i}`).trim() || c,
    )
    const effBackground =
      computed.getPropertyValue('--aui-starfield-background').trim() || background

    // Campo determinista por seed + tamaño.
    const stars = createStarfield({ width, height, density, colors: effColors, seed })

    // Capa estática offscreen: fondo + estrellas al alpha base (piso del titileo).
    const off = document.createElement('canvas')
    off.width = canvas.width
    off.height = canvas.height
    const offCtx = off.getContext('2d')
    if (offCtx) {
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      offCtx.fillStyle = effBackground
      offCtx.fillRect(0, 0, width, height)
      offCtx.globalAlpha = BASE_ALPHA
      for (const star of stars) {
        offCtx.fillStyle = star.color
        offCtx.beginPath()
        offCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        offCtx.fill()
      }
      offCtx.globalAlpha = 1
    }

    const drawTwinkle = (time: number) => {
      for (const star of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * TWINKLE_FREQ * speed * star.twinkleSpeed + star.phase)
        ctx.globalAlpha = TWINKLE_ALPHA * twinkle
        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    if (isStatic) {
      // Reduced motion: campo estático (cada estrella congelada en su fase),
      // sin fugaces ni RAF.
      ctx.drawImage(off, 0, 0, width, height)
      for (const star of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(star.phase)
        ctx.globalAlpha = TWINKLE_ALPHA * twinkle
        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      return
    }

    const shootingRng = createPrng(`${seed}:shooting`)
    const shooting: ShootingStar[] = []

    const drawShooting = (s: ShootingStar) => {
      const tailX = s.x - s.vx * SHOOTING_TAIL
      const tailY = s.y - s.vy * SHOOTING_TAIL
      const fade = s.life / s.maxLife
      const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${fade})`)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.strokeStyle = gradient
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(tailX, tailY)
      ctx.stroke()
    }

    let rafId = 0
    let last = 0
    let time = 0
    const loop = (ts: number) => {
      const dt = last === 0 ? 0 : (ts - last) / 1000
      last = ts
      time += dt

      ctx.drawImage(off, 0, 0, width, height)
      drawTwinkle(time)

      if (shootingStars > 0) {
        // Spawn por probabilidad media: `shootingStars` fugaces por minuto.
        if (shootingRng() < (shootingStars / 60) * dt) {
          shooting.push(spawnShootingStar(shootingRng, width, height))
        }
        stepShootingStars(shooting, dt)
        for (const s of shooting) drawShooting(s)
      }

      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [
    size.width,
    size.height,
    seed,
    density,
    colors,
    background,
    speed,
    shootingStars,
    isStatic,
  ])

  const colorVars: Record<string, string> = {}
  colors.forEach((c, i) => {
    colorVars[`--aui-starfield-color-${i}`] = c
  })

  return (
    <div
      ref={containerRef}
      className={`aui-starfield-background${className ? ` ${className}` : ''}`}
      style={
        {
          ...(fixed ? { position: 'fixed' as const } : null),
          ...colorVars,
          '--aui-starfield-background': background,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
