// sparkle-burst.tsx — Destellos breves (estrellas de 4 puntas) al hacer click.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Cada disparo dispersa estrellas alrededor de un punto con aparición
// escalonada; cada una crece rápido, gira y se encoge hasta apagarse
// (envolvente de vida). Se dibujan por path en canvas (no dependen de
// fuentes). El RAF arranca con el primer disparo y se detiene solo al no
// quedar destellos vivos. Con prefers-reduced-motion, fire() es un no-op.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const COLORS = ['#fde047', '#facc15', '#fef9c3', '#ffffff']
const COUNT = 10
const SPREAD = 55 // radio de dispersión en px
const SIZE = 12 // radio exterior máximo de la estrella
const LIFESPAN = 54 // frames (~0.9s)

interface Sparkle {
  x: number
  y: number
  rotation: number
  rotationSpeed: number
  size: number
  color: string
  delay: number
  age: number
  lifespan: number
}

// Envolvente: crece rápido hasta 1/4 de la vida, después se encoge.
const envelope = (t: number) => (t < 0.25 ? t / 0.25 : 1 - (t - 0.25) / 0.75)

export default function SparkleButton() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poolRef = useRef<Sparkle[]>([])
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

    // Spawn: disco uniforme alrededor del centro (sqrt evita amontonar).
    for (let i = 0; i < COUNT; i++) {
      const r = SPREAD * Math.sqrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      poolRef.current.push({
        x: width / 2 + Math.cos(theta) * r,
        y: height / 2 + Math.sin(theta) * r,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.12,
        size: SIZE * (0.5 + Math.random() * 0.5),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.round(Math.random() * LIFESPAN * 0.6),
        age: 0,
        lifespan: Math.round(LIFESPAN * (0.6 + Math.random() * 0.4)),
      })
    }

    if (rafRef.current !== null) return // ya hay un loop corriendo: acumula

    const loop = () => {
      const pool = poolRef.current
      ctx.clearRect(0, 0, width, height)
      for (let i = pool.length - 1; i >= 0; i--) {
        const s = pool[i]
        if (s.delay > 0) {
          s.delay--
          continue
        }
        s.age++
        s.rotation += s.rotationSpeed
        if (s.age >= s.lifespan) {
          pool.splice(i, 1)
          continue
        }
        const scale = envelope(s.age / s.lifespan)
        const outer = s.size * scale
        const inner = outer * 0.28
        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.rotate(s.rotation)
        ctx.globalAlpha = scale
        ctx.fillStyle = s.color
        // Estrella de 4 puntas: puntas sobre los ejes, cinturas en las
        // diagonales como puntos de control de curvas cuadráticas.
        ctx.beginPath()
        ctx.moveTo(0, -outer)
        ctx.quadraticCurveTo(inner * 0.707, -inner * 0.707, outer, 0)
        ctx.quadraticCurveTo(inner * 0.707, inner * 0.707, 0, outer)
        ctx.quadraticCurveTo(-inner * 0.707, inner * 0.707, -outer, 0)
        ctx.quadraticCurveTo(-inner * 0.707, -inner * 0.707, 0, -outer)
        ctx.fill()
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

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '60vh',
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
        ✨ Like
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
