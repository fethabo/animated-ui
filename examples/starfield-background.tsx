// starfield-background.tsx — Cielo estrellado vivo: estrellas titilando
// asíncronas + fugaces ocasionales, seedable y determinista.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Incluye un PRNG seedable mínimo inline (xmur3 + mulberry32): misma SEED y
// mismo tamaño ⇒ mismo cielo, sin Math.random. El campo se pinta una sola vez
// en un canvas offscreen; por frame solo se compone el titileo (alpha
// senoidal por estrella, con fase propia) y las fugaces. Con
// prefers-reduced-motion se pinta el campo estático, sin RAF.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const SEED = 'cielo'
const DENSITY = 2.5 // estrellas por cada 10.000 px²
const COLORS = ['#ffffff', '#bfdbfe', '#fde68a']
const BACKGROUND = '#050514'
const SHOOTING_PER_MINUTE = 10

// --- PRNG seedable mínimo (xmur3 + mulberry32) ---
function createPrng(seed: string): () => number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = (h ^= h >>> 16) >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Star {
  x: number
  y: number
  radius: number
  phase: number
  twinkleSpeed: number
  color: string
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

export default function StarfieldBackgroundDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = container.clientWidth
    const height = container.clientHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Campo determinista por seed + tamaño.
    const rng = createPrng(`${SEED}:${width}x${height}`)
    const count = Math.max(1, Math.round(((width * height) / 10_000) * DENSITY))
    const stars: Star[] = Array.from({ length: count }, () => ({
      x: rng() * width,
      y: rng() * height,
      radius: 0.4 + rng(),
      phase: rng() * Math.PI * 2,
      twinkleSpeed: 0.5 + rng(),
      color: COLORS[Math.floor(rng() * COLORS.length)],
    }))

    // Capa estática offscreen: fondo + estrellas al alpha base.
    const off = document.createElement('canvas')
    off.width = canvas.width
    off.height = canvas.height
    const offCtx = off.getContext('2d')!
    offCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    offCtx.fillStyle = BACKGROUND
    offCtx.fillRect(0, 0, width, height)
    offCtx.globalAlpha = 0.35
    for (const s of stars) {
      offCtx.fillStyle = s.color
      offCtx.beginPath()
      offCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
      offCtx.fill()
    }

    const drawStars = (time: number) => {
      ctx.drawImage(off, 0, 0, width, height)
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * 2.2 * s.twinkleSpeed + s.phase)
        ctx.globalAlpha = 0.65 * twinkle
        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawStars(0) // frame estático, sin titileo animado ni fugaces
      return
    }

    const shooting: ShootingStar[] = []
    let rafId = 0
    let last = 0
    let time = 0
    const loop = (ts: number) => {
      const dt = last === 0 ? 0 : (ts - last) / 1000
      last = ts
      time += dt
      drawStars(time)

      // Spawn por probabilidad media (fugaces por minuto).
      if (rng() < (SHOOTING_PER_MINUTE / 60) * dt) {
        const tilt = Math.PI / 9 + rng() * (Math.PI / 4.5 - Math.PI / 9)
        const direction = rng() < 0.5 ? -1 : 1
        const speed = 320 + rng() * 320
        const life = 0.5 + rng() * 0.6
        shooting.push({
          x: rng() * width,
          y: rng() * height * 0.33,
          vx: Math.cos(tilt) * speed * direction,
          vy: Math.sin(tilt) * speed,
          life,
          maxLife: life,
        })
      }
      for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i]
        s.life -= dt
        if (s.life <= 0) {
          shooting.splice(i, 1)
          continue
        }
        s.x += s.vx * dt
        s.y += s.vy * dt
        const tailX = s.x - s.vx * 0.12
        const tailY = s.y - s.vy * 0.12
        const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${s.life / s.maxLife})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative', height: 400 }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
