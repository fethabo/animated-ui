// flow-field.tsx — Partículas que siguen un campo vectorial de ruido dejando
// trazos orgánicos con fade.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Incluye un simplex 2D seedable mínimo inline. El ángulo de avance de cada
// partícula sale del valor del ruido en su posición (una muestra por
// partícula por frame); la persistencia del trazo se logra pintando por frame
// un velo semitransparente del color de fondo — sin historial de posiciones.
// El componente pinta su propio fondo (el velo lo requiere). Con
// prefers-reduced-motion se pre-simulan trazos estáticos sin loop.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const COUNT = 500
const SPEED = 1
const COLORS = ['#22d3ee', '#a78bfa', '#f472b6']
const FADE = 0.95 // persistencia 0-1: más alto = trazos más duraderos
const SCALE = 200 // zoom del campo: mayor = curvas más amplias
const BACKGROUND = '#0a0a12'
const SEED = 'flow'

// --- Simplex 2D seedable mínimo (permutación via mulberry32 + xmur3) ---
function createNoise2D(seed: string): (x: number, y: number) => number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = (h ^= h >>> 16) >>> 0
  const rng = () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const p = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  const perm = [...p, ...p]
  const G = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
  const F2 = 0.5 * (Math.sqrt(3) - 1)
  const G2 = (3 - Math.sqrt(3)) / 6
  return (xin, yin) => {
    const s = (xin + yin) * F2
    const i = Math.floor(xin + s)
    const j = Math.floor(yin + s)
    const t = (i + j) * G2
    const x0 = xin - (i - t)
    const y0 = yin - (j - t)
    const i1 = x0 > y0 ? 1 : 0
    const j1 = x0 > y0 ? 0 : 1
    const corners = [
      [x0, y0, i, j],
      [x0 - i1 + G2, y0 - j1 + G2, i + i1, j + j1],
      [x0 - 1 + 2 * G2, y0 - 1 + 2 * G2, i + 1, j + 1],
    ]
    let n = 0
    for (const [x, y, ci, cj] of corners) {
      const tt = 0.5 - x * x - y * y
      if (tt <= 0) continue
      const g = G[perm[(ci & 255) + perm[cj & 255]] % 12]
      n += tt * tt * tt * tt * (g[0] * x + g[1] * y)
    }
    return 70 * n
  }
}

interface Particle {
  x: number
  y: number
  px: number
  py: number
  color: string
}

export default function FlowFieldDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noise = createNoise2D(SEED)

    const width = container.clientWidth
    const height = container.clientHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const x = Math.random() * width
      const y = Math.random() * height
      return { x, y, px: x, py: y, color: COLORS[Math.floor(Math.random() * COLORS.length)] }
    })

    // Fondo inicial opaco (necesario para el velo del fade).
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, width, height)

    const step = (withVeil: boolean) => {
      if (withVeil) {
        // Velo semitransparente: los trazos viejos se desvanecen solos.
        ctx.globalAlpha = 1 - FADE
        ctx.fillStyle = BACKGROUND
        ctx.fillRect(0, 0, width, height)
        ctx.globalAlpha = 1
      }
      ctx.lineWidth = 1
      for (const p of particles) {
        p.px = p.x
        p.py = p.y
        // El ángulo sale del campo de ruido en la posición de la partícula.
        const angle = noise(p.x / SCALE, p.y / SCALE) * Math.PI
        p.x += Math.cos(angle) * SPEED
        p.y += Math.sin(angle) * SPEED
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          p.x = Math.random() * width
          p.y = Math.random() * height
          p.px = p.x
          p.py = p.y
        }
        ctx.strokeStyle = p.color
        ctx.beginPath()
        ctx.moveTo(p.px, p.py)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
    }

    if (reduce) {
      // Composición estática: presupuesto fijo de pasos, sin velo ni loop.
      for (let i = 0; i < 300; i++) step(false)
      return
    }

    let raf = 0
    const loop = () => {
      step(true)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
