// waves-background.tsx — Fondo de líneas fluidas que ondulan con ruido simplex.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Incluye un simplex 2D seedable mínimo inline: cada línea horizontal se
// curva con noise(x, t) — el tiempo entra como coordenada del campo, así la
// ondulación es continua y sin repetición periódica. El muestreo es espaciado
// (~8 px por punto, nunca por pixel). Determinista por seed. Con
// prefers-reduced-motion se dibuja un frame estático sin loop.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const LINES = 28
const AMPLITUDE = 26
const SPEED = 1
const COLORS: [string, string] = ['#22d3ee', '#a78bfa'] // extremos del degradado
const LINE_WIDTH = 1.5
const SEED = 'waves'

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

// Interpola dos hex #rrggbb según f (0-1).
function lerpColor(from: string, to: string, f: number): string {
  const parse = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
  const [r1, g1, b1] = parse(from)
  const [r2, g2, b2] = parse(to)
  return `rgb(${Math.round(r1 + (r2 - r1) * f)}, ${Math.round(g1 + (g2 - g1) * f)}, ${Math.round(b1 + (b2 - b1) * f)})`
}

export default function WavesBackgroundDemo() {
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

    let width = 0
    let height = 0
    const resize = () => {
      width = container.clientWidth
      height = container.clientHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = LINE_WIDTH
      for (let i = 0; i < LINES; i++) {
        const baseY = (height * (i + 0.5)) / LINES
        ctx.strokeStyle = lerpColor(COLORS[0], COLORS[1], LINES > 1 ? i / (LINES - 1) : 0)
        ctx.beginPath()
        // Muestreo cada ~8 px; la fase por línea evita que ondulen en bloque.
        for (let x = 0; x <= width; x += 8) {
          const y = baseY + noise(x / 260, t + i * 0.35) * AMPLITUDE
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
    }

    if (reduce) {
      draw(0) // frame estático: curvado pero inmóvil
      return
    }

    let t = 0
    let raf = 0
    const loop = () => {
      t += 0.006 * SPEED
      draw(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100vh', background: '#050510' }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
