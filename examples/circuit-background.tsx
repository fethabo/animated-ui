// circuit-background.tsx — Fondo de circuito PCB procedural sobre canvas:
// pistas ortogonales generadas con random walk seedado + pulsos de luz que las
// recorren. Determinista por seed (sin Math.random en la generación), estable
// SSR↔hidratación.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef, useState } from 'react'

type Point = { x: number; y: number }

// --- PRNG seedable (xmur3 + mulberry32): determinista, sin estado global. ---
function createPrng(seed: string | number) {
  const str = String(seed)
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = (Math.imul(h ^ (h >>> 16), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const int = (rng: () => number, min: number, max: number) => Math.floor(min + rng() * (max - min + 1))

const CELL = 36
const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

function routeCircuit(width: number, height: number, seed: string, density: number) {
  const tracks: Point[][] = []
  const pads: Point[] = []
  if (width <= 0 || height <= 0) return { tracks, pads }
  const cols = Math.max(2, Math.floor(width / CELL))
  const rows = Math.max(2, Math.floor(height / CELL))
  const rng = createPrng(`${seed}:${cols}x${rows}:${density}`)
  const offX = (width - cols * CELL) / 2
  const offY = (height - rows * CELL) / 2
  const toPx = (c: number, r: number): Point => ({ x: offX + (c + 0.5) * CELL, y: offY + (r + 0.5) * CELL })
  const occupied = new Set<number>()
  const key = (c: number, r: number) => r * cols + c
  const target = Math.max(1, Math.round(((cols * rows) / 14) * density))
  const maxReach = Math.max(5, Math.floor(Math.max(cols, rows) * 0.8))

  for (let t = 0; t < target; t++) {
    let start: [number, number] | null = null
    for (let tries = 0; tries < 24; tries++) {
      const c = int(rng, 0, cols - 1)
      const r = int(rng, 0, rows - 1)
      if (!occupied.has(key(c, r))) {
        start = [c, r]
        break
      }
    }
    if (!start) break
    let [c, r] = start
    let dir = int(rng, 0, 3)
    occupied.add(key(c, r))
    const verts: Array<[number, number]> = [[c, r]]
    const maxLen = int(rng, 4, maxReach)
    let steps = 0
    while (steps < maxLen) {
      let nd = dir
      if (rng() > 0.8) {
        const perps = dir < 2 ? [2, 3] : [0, 1]
        nd = perps[Math.floor(rng() * 2)]
      }
      const nc = c + DIRS[nd][0]
      const nr = r + DIRS[nd][1]
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) break
      if (occupied.has(key(nc, nr))) {
        pads.push(toPx(nc, nr))
        break
      }
      if (nd !== dir) verts.push([c, r])
      c = nc
      r = nr
      occupied.add(key(c, r))
      dir = nd
      steps++
    }
    verts.push([c, r])
    const poly: Point[] = []
    for (const [vc, vr] of verts) {
      const last = poly[poly.length - 1]
      const p = toPx(vc, vr)
      if (!last || last.x !== p.x || last.y !== p.y) poly.push(p)
    }
    if (poly.length >= 2) {
      tracks.push(poly)
      pads.push(poly[0], poly[poly.length - 1])
    }
  }
  return { tracks, pads }
}

function polylineLength(points: Point[]) {
  let total = 0
  for (let i = 1; i < points.length; i++) total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
  return total
}
function pointAtDistance(points: Point[], distance: number): Point {
  if (distance <= 0) return points[0]
  let remaining = distance
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const len = Math.hypot(b.x - a.x, b.y - a.y)
    if (remaining <= len) {
      const t = remaining / len
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    }
    remaining -= len
  }
  return points[points.length - 1]
}

function CircuitBackground({
  seed,
  density,
  trackColor,
  pulseColor,
  pulseCount,
}: {
  seed: string
  density: number
  trackColor: string
  pulseColor: string
  pulseCount: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const width = container.clientWidth
    const height = container.clientHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const lineWidth = 2
    const { tracks, pads } = routeCircuit(width, height, seed, density)
    const lengths = tracks.map(polylineLength)

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = trackColor
      ctx.fillStyle = trackColor
      ctx.lineWidth = lineWidth
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      for (const poly of tracks) {
        ctx.beginPath()
        ctx.moveTo(poly[0].x, poly[0].y)
        for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i].x, poly[i].y)
        ctx.stroke()
      }
      for (const pad of pads) {
        ctx.beginPath()
        ctx.arc(pad.x, pad.y, lineWidth * 1.7, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const routable = tracks.map((_, i) => i).filter((i) => lengths[i] > 0)
    const pulseRng = createPrng(`${seed}:pulses`)
    const pulses = routable.length
      ? Array.from({ length: pulseCount }, () => {
          const track = routable[int(pulseRng, 0, routable.length - 1)]
          return { track, head: pulseRng() * lengths[track] }
        })
      : []

    if (reduce) {
      drawStatic()
      return
    }

    let raf = 0
    let last = 0
    const loop = (ts: number) => {
      const dt = last === 0 ? 0 : (ts - last) / 1000
      last = ts
      drawStatic()
      ctx.fillStyle = pulseColor
      for (const p of pulses) {
        p.head += 90 * dt
        const len = lengths[p.track]
        if (p.head - 30 > len) {
          p.track = routable[int(pulseRng, 0, routable.length - 1)]
          p.head = 0
        }
        const poly = tracks[p.track]
        for (let k = 8; k >= 0; k--) {
          const dd = p.head - (k / 8) * 30
          if (dd < 0) continue
          ctx.globalAlpha = (1 - k / 8) ** 2
          const pt = pointAtDistance(poly, dd)
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, lineWidth * 0.9, 0, Math.PI * 2)
          ctx.fill()
        }
        const hp = pointAtDistance(poly, p.head)
        ctx.globalAlpha = 1
        ctx.shadowBlur = 8
        ctx.shadowColor = pulseColor
        ctx.beginPath()
        ctx.arc(hp.x, hp.y, lineWidth * 1.3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [seed, density, trackColor, pulseColor, pulseCount])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

export default function CircuitBackgroundDemo() {
  const [seed, setSeed] = useState('hero')
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#050a14' }}>
      <CircuitBackground seed={seed} density={1.2} trackColor="#1e3a5f" pulseColor="#22d3ee" pulseCount={10} />
      <button
        onClick={() => setSeed(String(Math.floor(Math.random() * 1e6)))}
        style={{ position: 'absolute', top: 16, left: 16, padding: '8px 12px', borderRadius: 8 }}
      >
        Nueva seed: {seed}
      </button>
    </div>
  )
}
