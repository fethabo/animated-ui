// emoji-burst.tsx — Ráfaga de emojis con física de confetti, sin assets.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Los emojis se renderizan con fillText y la fuente de emojis de la
// plataforma (el aspecto varía entre sistemas operativos — es lo esperado).
// Física de confetti: abanico desde el origen, gravedad, drag, giro 2D y
// fade. El RAF arranca con el primer disparo y se detiene solo al no quedar
// partículas vivas. Con prefers-reduced-motion, fire() es un no-op.
// Nota de performance: fillText por partícula es más caro que las formas del
// confetti — mantené el count moderado (~30).
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const EMOJIS = ['🎉', '✨', '❤️']
const COUNT = 30
const SIZE = 24 // tamaño de fuente base en px
const ANGLE = 90 // grados; 90 = hacia arriba
const SPREAD = 70
const POWER = 11
const GRAVITY = 0.25
const DRAG = 0.985

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  emoji: string
  size: number
  life: number
  decay: number
}

export default function EmojiButton() {
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

  const fire = (emojis: string[] = EMOJIS) => {
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

    for (let i = 0; i < COUNT; i++) {
      const direction = ((ANGLE + (Math.random() - 0.5) * SPREAD) * Math.PI) / 180
      const speed = POWER * (0.4 + Math.random() * 0.6)
      poolRef.current.push({
        x: width / 2,
        y: height / 2,
        vx: Math.cos(direction) * speed,
        vy: -Math.sin(direction) * speed, // eje y del canvas crece hacia abajo
        rotation: (Math.random() - 0.5) * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.24,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: SIZE * (0.75 + Math.random() * 0.5),
        life: 1,
        decay: 0.006 + Math.random() * 0.008,
      })
    }

    if (rafRef.current !== null) return // ya hay un loop corriendo: acumula

    const loop = () => {
      const pool = poolRef.current
      ctx.clearRect(0, 0, width, height)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      let currentSize = -1
      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i]
        p.vy += GRAVITY
        p.vx *= DRAG
        p.vy *= DRAG
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.life -= p.decay
        if (p.life <= 0 || p.y - p.size > height || p.x + p.size < 0 || p.x - p.size > width) {
          pool.splice(i, 1)
          continue
        }
        // El font se re-setea solo cuando cambia el tamaño (fillText es caro).
        const fontSize = Math.round(p.size)
        if (fontSize !== currentSize) {
          ctx.font = `${fontSize}px sans-serif`
          currentSize = fontSize
        }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life))
        ctx.fillText(p.emoji, 0, 0)
        ctx.restore()
      }
      if (pool.length === 0) {
        rafRef.current = null // pool vacío → el RAF se detiene solo
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    fontSize: '1.1rem',
    borderRadius: 12,
    border: 'none',
    background: '#7c3aed',
    color: '#fff',
    cursor: 'pointer',
  } as const

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
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => fire(['❤️'])} style={buttonStyle}>❤️</button>
        <button onClick={() => fire(['🎉', '🥳'])} style={buttonStyle}>🎉</button>
        <button onClick={() => fire()} style={buttonStyle}>Mix</button>
      </div>
      {/* Overlay pasivo: los clicks pasan a través. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
    </div>
  )
}
