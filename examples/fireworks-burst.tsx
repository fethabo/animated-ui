// fireworks-burst.tsx — Fuegos artificiales one-shot disparados por un botón.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Cada disparo lanza cohetes desde la base que ascienden con un wobble
// lateral y explotan al agotar su impulso (apex) en chispas radiales con
// gravedad, drag y fade. Un solo pool con dos fases (rocket → spark); el RAF
// arranca con el primer disparo y se detiene solo cuando no quedan
// partículas vivas — costo cero en reposo. Con prefers-reduced-motion,
// fire() es un no-op.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const COLORS = ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa']
const ROCKETS = 3 // cohetes por disparo (despegue escalonado)
const SPARKS = 70 // chispas por explosión
const POWER = 13 // impulso de ascenso en px/frame
const GRAVITY = 0.18 // px/frame²
const DRAG = 0.98

interface Particle {
  rocket: boolean
  x: number
  y: number
  vx: number
  vy: number
  delay: number // frames antes del despegue (solo cohetes)
  wobble: number // fase del vaivén lateral (solo cohetes)
  color: string
  size: number
  life: number
  decay: number
}

export default function FireworksButton() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poolRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const fire = () => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = container.clientWidth
    const height = container.clientHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Spawn: cohetes desde la base, con delay incremental entre despegues.
    let delay = 0
    for (let i = 0; i < ROCKETS; i++) {
      poolRef.current.push({
        rocket: true,
        x: width / 2 + (Math.random() - 0.5) * width * 0.3,
        y: height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -POWER * (0.85 + Math.random() * 0.25),
        delay,
        wobble: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 2,
        life: 1,
        decay: 0,
      })
      delay += 6 + Math.round(Math.random() * 10)
    }

    if (rafRef.current !== null) return // ya hay un loop corriendo: acumula

    const loop = () => {
      const pool = poolRef.current
      ctx.clearRect(0, 0, width, height)
      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i]
        if (p.rocket) {
          if (p.delay > 0) {
            p.delay--
            continue
          }
          p.vy += GRAVITY
          p.wobble += 0.25
          p.x += p.vx + Math.sin(p.wobble) * 0.6
          p.y += p.vy
          // Apex: el impulso se agotó → explota en chispas radiales.
          if (p.vy >= -0.5) {
            const sparks: Particle[] = []
            for (let j = 0; j < SPARKS; j++) {
              const dir = Math.random() * Math.PI * 2
              const speed = POWER * 0.45 * (0.25 + Math.random() * 0.75)
              sparks.push({
                rocket: false,
                x: p.x,
                y: p.y,
                vx: Math.cos(dir) * speed,
                vy: Math.sin(dir) * speed,
                delay: 0,
                wobble: 0,
                color: Math.random() < 0.15 ? '#ffffff' : p.color,
                size: 1.5 + Math.random() * 1.5,
                life: 1,
                decay: 0.007 + Math.random() * 0.009,
              })
            }
            pool.splice(i, 1, ...sparks)
            continue
          }
          // Cohete: trazo corto contrario a la velocidad.
          ctx.strokeStyle = p.color
          ctx.globalAlpha = 0.9
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5)
          ctx.stroke()
          continue
        }
        p.vy += GRAVITY
        p.vx *= DRAG
        p.vy *= DRAG
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        if (p.life <= 0 || p.y - p.size > height) {
          pool.splice(i, 1)
          continue
        }
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      if (pool.length === 0) {
        rafRef.current = null // pool vacío → el RAF se detiene solo
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#050510',
      }}
    >
      <button
        onClick={fire}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1.1rem',
          borderRadius: 12,
          border: 'none',
          background: '#7c3aed',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        🎆 ¡Fuegos!
      </button>
      {/* Overlay pasivo: los clicks pasan a través. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
    </div>
  )
}
