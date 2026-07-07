// topographic-background.tsx — Curvas de nivel animadas (mapa topográfico
// vivo) extraídas de un campo de ruido con marching squares.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Incluye un simplex 2D seedable mínimo inline. El terreno es un campo fBm
// (3 octavas) muestreado sobre una grilla de celdas (~24 px, nunca por
// pixel); cada nivel se extrae con marching squares interpolando el cruce en
// las aristas (curvas suaves, sin artefactos de grilla). El recálculo ocurre
// a intervalos espaciados — no cada frame. Con prefers-reduced-motion el
// mapa se dibuja una vez, estático.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const LEVELS = 12
const COLOR = '#38bdf8'
const LINE_WIDTH = 1
const SCALE = 220 // zoom del terreno: mayor = relieves más amplios
const SPEED = 1 // 0 = terreno fijo
const SEED = 'terrain'
const CELL = 24 // lado de la celda de muestreo en px

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

export default function TopographicBackgroundDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const base = createNoise2D(SEED)
    // fBm de 3 octavas: detalle fractal del terreno, normalizado a [-1, 1].
    const field = (x: number, y: number) =>
      (base(x, y) + 0.5 * base(x * 2, y * 2) + 0.25 * base(x * 4, y * 4)) / 1.75

    const width = container.clientWidth
    const height = container.clientHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cols = Math.ceil(width / CELL)
    const rows = Math.ceil(height / CELL)
    const cellW = width / cols
    const cellH = height / rows

    const draw = (t: number) => {
      // Muestreo del campo en las esquinas de la grilla (no por pixel).
      const values: number[][] = []
      for (let r = 0; r <= rows; r++) {
        const row: number[] = []
        for (let c = 0; c <= cols; c++) {
          row.push(field((c * cellW) / SCALE + t * 0.21, (r * cellH) / SCALE + t * 0.13))
        }
        values.push(row)
      }

      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = COLOR
      ctx.lineWidth = LINE_WIDTH
      for (let level = 0; level < LEVELS; level++) {
        const threshold = -0.8 + (1.6 * (level + 0.5)) / LEVELS
        ctx.beginPath()
        // Marching squares: clasifica cada celda por sus 4 esquinas e
        // interpola el cruce de la isolínea sobre las aristas.
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const tl = values[r][c]
            const tr = values[r][c + 1]
            const br = values[r + 1][c + 1]
            const bl = values[r + 1][c]
            let idx = 0
            if (tl > threshold) idx |= 8
            if (tr > threshold) idx |= 4
            if (br > threshold) idx |= 2
            if (bl > threshold) idx |= 1
            if (idx === 0 || idx === 15) continue
            const lerp = (a: number, b: number) => (b === a ? 0.5 : (threshold - a) / (b - a))
            const top = () => [c + lerp(tl, tr), r]
            const right = () => [c + 1, r + lerp(tr, br)]
            const bottom = () => [c + lerp(bl, br), r + 1]
            const left = () => [c, r + lerp(tl, bl)]
            const table: Record<number, Array<[number[], number[]]>> = {
              1: [[left(), bottom()]],
              2: [[bottom(), right()]],
              3: [[left(), right()]],
              4: [[top(), right()]],
              5: [[top(), left()], [bottom(), right()]],
              6: [[top(), bottom()]],
              7: [[top(), left()]],
              8: [[top(), left()]],
              9: [[top(), bottom()]],
              10: [[top(), right()], [left(), bottom()]],
              11: [[top(), right()]],
              12: [[left(), right()]],
              13: [[bottom(), right()]],
              14: [[left(), bottom()]],
            }
            for (const [p, q] of table[idx]) {
              ctx.moveTo(p[0] * cellW, p[1] * cellH)
              ctx.lineTo(q[0] * cellW, q[1] * cellH)
            }
          }
        }
        ctx.stroke()
      }
    }

    draw(0)
    if (reduce || SPEED === 0) return // mapa estático, sin loop

    let t = 0
    let frame = 0
    let raf = 0
    const loop = () => {
      frame++
      // Recalcula a intervalos espaciados (cada 8 frames), no por frame.
      if (frame % 8 === 0) {
        t += 0.016 * SPEED
        draw(t)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100vh', background: '#0b1120' }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
