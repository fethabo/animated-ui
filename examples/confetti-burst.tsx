// confetti-burst.tsx — Ráfaga de confetti one-shot disparada por un botón.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El canvas es un overlay pasivo (`pointer-events: none`) que no anima al
// montar: `fire()` spawnea copos que salen en abanico desde el origen, caen
// con gravedad y drag, y giran con tumbling 3D simulado (el eje menor se
// escala con cos(fase)). El pool vive en un ref y el RAF arranca con el
// primer disparo y se detiene solo cuando no quedan copos vivos — costo cero
// en reposo. Disparos sucesivos se acumulan sobre el mismo canvas. Con
// prefers-reduced-motion, fire() es un no-op.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const COLORS = ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa']
const COUNT = 120
const ANGLE = 90 // grados; 90 = hacia arriba
const SPREAD = 70 // apertura total del cono en grados
const POWER = 13 // velocidad inicial en px/frame
const GRAVITY = 0.25 // px/frame²
const DRAG = 0.985

interface Flake {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  tumble: number
  tumbleSpeed: number
  size: number
  color: string
  circle: boolean
  life: number
  decay: number
}

export default function ConfettiButton() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flakesRef = useRef<Flake[]>([])
  const rafRef = useRef<number | null>(null)

  // Detiene el loop al desmontar.
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

    // Spawn: abanico centrado en ANGLE con apertura SPREAD, desde el centro.
    for (let i = 0; i < COUNT; i++) {
      const direction = ((ANGLE + (Math.random() - 0.5) * SPREAD) * Math.PI) / 180
      const speed = POWER * (0.4 + Math.random() * 0.6)
      flakesRef.current.push({
        x: width / 2,
        y: height / 2,
        vx: Math.cos(direction) * speed,
        vy: -Math.sin(direction) * speed, // eje y del canvas crece hacia abajo
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.4,
        tumble: Math.random() * Math.PI * 2,
        tumbleSpeed: 0.08 + Math.random() * 0.22,
        size: 6 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        circle: Math.random() < 0.4,
        life: 1,
        decay: 0.006 + Math.random() * 0.008,
      })
    }

    if (rafRef.current !== null) return // ya hay un loop corriendo: acumula

    const loop = () => {
      const flakes = flakesRef.current
      ctx.clearRect(0, 0, width, height)
      for (let i = flakes.length - 1; i >= 0; i--) {
        const f = flakes[i]
        f.vy += GRAVITY
        f.vx *= DRAG
        f.vy *= DRAG
        f.x += f.vx
        f.y += f.vy
        f.rotation += f.rotationSpeed
        f.tumble += f.tumbleSpeed
        f.life -= f.decay
        // Culling: por vida agotada o por salir del área.
        if (f.life <= 0 || f.y - f.size > height || f.x + f.size < 0 || f.x - f.size > width) {
          flakes.splice(i, 1)
          continue
        }
        ctx.save()
        ctx.translate(f.x, f.y)
        ctx.rotate(f.rotation)
        ctx.globalAlpha = Math.max(0, Math.min(1, f.life))
        ctx.fillStyle = f.color
        const sy = Math.cos(f.tumble) // tumbling 3D simulado
        if (f.circle) {
          ctx.beginPath()
          ctx.ellipse(0, 0, f.size / 2, Math.max(0.5, (f.size / 2) * Math.abs(sy)), 0, 0, Math.PI * 2)
          ctx.fill()
        } else {
          const minor = f.size * 0.6 * sy
          ctx.fillRect(-f.size / 2, -minor / 2, f.size, minor)
        }
        ctx.restore()
      }
      if (flakes.length === 0) {
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
        🎉 ¡Celebrar!
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
