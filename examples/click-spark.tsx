// click-spark.tsx — Chispas automáticas en cada click dentro del contenedor.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// La variante declarativa de la categoría celebración/feedback: sin ref ni
// handle — cada pointerdown emite chispas radiales en el punto del evento.
// El canvas es un overlay pointer-events:none (el contenido sigue siendo
// interactivo) y clicks rápidos acumulan ráfagas sobre el mismo RAF, que se
// detiene solo al no quedar chispas — costo cero en reposo. Con
// prefers-reduced-motion no se emiten chispas.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef, type PointerEvent } from 'react'

const COLORS = ['#fbbf24', '#f59e0b', '#fde68a']
const COUNT = 8 // chispas por click
const RADIUS = 40 // alcance aproximado en px
const SIZE = 8 // largo base del segmento
const LIFESPAN = 24 // frames (~0.4s)
const DRAG = 0.88

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  decay: number
}

export default function ClickSparkArea() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poolRef = useRef<Spark[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
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

    const rect = container.getBoundingClientRect()
    const originX = event.clientX - rect.left
    const originY = event.clientY - rect.top

    // Con drag multiplicativo d, el recorrido total ≈ v0·d/(1−d): se despeja
    // v0 para que el alcance sea ~RADIUS.
    const v0 = (RADIUS * (1 - DRAG)) / DRAG
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
      const speed = v0 * (0.55 + Math.random() * 0.45)
      poolRef.current.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: SIZE * (0.6 + Math.random() * 0.6),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
        decay: 1 / (LIFESPAN * (0.65 + Math.random() * 0.35)),
      })
    }

    if (rafRef.current !== null) return // ya hay un loop corriendo: acumula

    const loop = () => {
      const pool = poolRef.current
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.lineWidth = 2
      for (let i = pool.length - 1; i >= 0; i--) {
        const s = pool[i]
        s.vx *= DRAG
        s.vy *= DRAG
        s.x += s.vx
        s.y += s.vy
        s.life -= s.decay
        if (s.life <= 0) {
          pool.splice(i, 1)
          continue
        }
        // Segmento radial contrario a la velocidad, que se consume con la vida.
        const len = s.size * s.life
        const speed = Math.hypot(s.vx, s.vy) || 1
        ctx.globalAlpha = Math.max(0, s.life)
        ctx.strokeStyle = s.color
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - (s.vx / speed) * len, s.y - (s.vy / speed) * len)
        ctx.stroke()
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
      onPointerDown={onPointerDown}
      style={{
        position: 'relative',
        width: '100%',
        height: '60vh',
        display: 'grid',
        placeItems: 'center',
        background: '#050510',
        color: '#e4e4e7',
      }}
    >
      <button
        onClick={() => console.log('el contenido sigue siendo interactivo')}
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
        Clickeá donde quieras
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
