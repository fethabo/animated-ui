// guiding-branches.tsx — Director de atención orgánico: tras inactividad del
// mouse, crecen ramas generativas desde el puntero (ambient en todas
// direcciones, o sesgadas hacia un target). Estéticas intercambiables (roots /
// lightning). Overlay pointer-events:none; se desactiva con reduced motion.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

type Point = { x: number; y: number }
type Branch = { points: Point[]; delay: number; width: number; length: number }

function createPrng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
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
const range = (rng: () => number, a: number, b: number) => a + rng() * (b - a)

function jaggedBolt(rng: () => number, from: Point, to: Point, jitter: number, detail = 2): Point[] {
  let pts: Point[] = [from, to]
  let amp = jitter
  for (let d = 0; d < detail; d++) {
    const next: Point[] = [pts[0]]
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]
      const b = pts[i]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const len = Math.hypot(dx, dy) || 1
      const off = (rng() * 2 - 1) * amp
      next.push({ x: (a.x + b.x) / 2 + (-dy / len) * off, y: (a.y + b.y) / 2 + (dx / len) * off })
      next.push(b)
    }
    pts = next
    amp *= 0.5
  }
  return pts
}

// Esqueleto compartido por roots/lightning, con curvatura orgánica (curl) y
// afinado por profundidad (width). Una turnRate que varía lento da arcos suaves
// de raíz (no zigzag de rayo).
function buildSkeleton(rng: () => number, origin: Point, maxDistance: number, density: number, depth: number, curl: number, bias: number | null) {
  const branches: Array<{ points: Point[]; delay: number; width: number }> = []
  const branchProb = Math.min(0.7, 0.25 + density * 0.08)
  const step = maxDistance / (6 + curl * 8)
  const dist = (p: Point) => Math.hypot(p.x - origin.x, p.y - origin.y)

  const grow = (start: Point, angle: number, budget: number, d: number, delay: number, curlScale: number) => {
    const nodes: Point[] = [start]
    let pos = start
    let traveled = 0
    let ang = angle
    const driftMag = (0.1 + curl * 0.55) * curlScale
    let turnRate = range(rng, -driftMag, driftMag)
    const maxTurn = driftMag * 2.2
    while (traveled < budget) {
      turnRate += range(rng, -driftMag * 0.5, driftMag * 0.5)
      turnRate = Math.max(-maxTurn, Math.min(maxTurn, turnRate))
      ang += turnRate
      const seg = Math.min(step, budget - traveled)
      const np = { x: pos.x + Math.cos(ang) * seg, y: pos.y + Math.sin(ang) * seg }
      if (dist(np) > maxDistance) break
      nodes.push(np)
      pos = np
      traveled += seg
      if (d > 0 && traveled > step && rng() < branchProb) {
        grow(pos, ang + (rng() < 0.5 ? -1 : 1) * range(rng, 0.5, 1.1), budget * range(rng, 0.4, 0.6), d - 1, delay + traveled, curlScale)
      }
    }
    if (nodes.length >= 2) branches.push({ points: nodes, delay, width: Math.max(0.35, Math.pow(0.62, depth - d)) })
  }

  if (bias === null) {
    const trunks = Math.max(2, Math.round(density))
    for (let t = 0; t < trunks; t++) grow(origin, (t / trunks) * Math.PI * 2 + range(rng, -0.3, 0.3), maxDistance * range(rng, 0.75, 1), depth, 0, 1)
  } else {
    grow(origin, bias + range(rng, -0.12, 0.12), maxDistance, depth, 0, 0.3)
    const trunks = Math.max(1, Math.round(density / 2))
    for (let t = 0; t < trunks; t++) grow(origin, bias + range(rng, -1.2, 1.2), maxDistance * range(rng, 0.45, 0.7), depth - 1, 0, 1)
  }
  return branches
}

const AX = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

// Estética circuit: trazos ortogonales que se expanden 360° desde el origen.
function buildCircuit(rng: () => number, origin: Point, maxDistance: number, density: number, depth: number) {
  const branches: Array<{ points: Point[]; delay: number; width: number }> = []
  const step = maxDistance / 6
  const branchProb = Math.min(0.7, 0.28 + density * 0.07)
  const widthAt = (d: number) => Math.max(0.4, Math.pow(0.7, depth - d))
  const dist = (p: Point) => Math.hypot(p.x - origin.x, p.y - origin.y)
  const outward = (pos: Point, dir: number) => {
    const perps = dir < 2 ? [2, 3] : [0, 1]
    if (rng() < 0.3) return perps[rng() < 0.5 ? 0 : 1]
    const d0 = dist({ x: pos.x + AX[perps[0]][0] * step, y: pos.y + AX[perps[0]][1] * step })
    const d1 = dist({ x: pos.x + AX[perps[1]][0] * step, y: pos.y + AX[perps[1]][1] * step })
    return d1 > d0 ? perps[1] : perps[0]
  }
  const grow = (start: Point, dir0: number, budget: number, d: number, delay: number) => {
    const nodes: Point[] = [start]
    let pos = start
    let traveled = 0
    let dir = dir0
    while (traveled < budget) {
      if (rng() > 0.72) dir = outward(pos, dir)
      const np = { x: pos.x + AX[dir][0] * step, y: pos.y + AX[dir][1] * step }
      if (dist(np) > maxDistance) break
      nodes.push(np)
      pos = np
      traveled += step
      if (d > 0 && traveled > step && rng() < branchProb) grow(pos, outward(pos, dir), budget * (0.4 + rng() * 0.2), d - 1, delay + traveled)
    }
    if (nodes.length >= 2) branches.push({ points: nodes, delay, width: widthAt(d) })
  }
  const trunks = Math.max(4, Math.round(density * 1.5))
  for (let t = 0; t < trunks; t++) grow(origin, t % 4, maxDistance * (0.75 + rng() * 0.25), depth, 0)
  return branches
}

function generate(aesthetic: string, rng: () => number, origin: Point, maxDistance: number, density: number, depth: number, curl: number, bias: number | null) {
  if (aesthetic === 'circuit') return buildCircuit(rng, origin, maxDistance, density, depth)
  const skeleton = buildSkeleton(rng, origin, maxDistance, density, depth, curl, bias)
  if (aesthetic === 'lightning') {
    const jitter = Math.max(3, maxDistance * 0.04)
    return skeleton.map((b) => {
      const points: Point[] = [b.points[0]]
      for (let i = 1; i < b.points.length; i++) {
        const bolt = jaggedBolt(rng, b.points[i - 1], b.points[i], jitter)
        for (let k = 1; k < bolt.length; k++) points.push(bolt[k])
      }
      return { points, delay: b.delay, width: b.width }
    })
  }
  return skeleton
}

function length(points: Point[]) {
  let t = 0
  for (let i = 1; i < points.length; i++) t += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
  return t
}

function strokePartial(ctx: CanvasRenderingContext2D, points: Point[], len: number) {
  if (points.length < 2 || len <= 0) return
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  let remaining = len
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const segLen = Math.hypot(b.x - a.x, b.y - a.y)
    if (remaining >= segLen) {
      ctx.lineTo(b.x, b.y)
      remaining -= segLen
    } else {
      const t = remaining / segLen
      ctx.lineTo(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
      break
    }
  }
  ctx.stroke()
}

function GuidingBranches({
  target,
  aesthetic = 'roots',
  idleDelay = 2000,
  color = '#34d399',
  speed = 320,
  maxDistance = 260,
  duration = 1400,
  density = 4,
  depth = 3,
  curl = 0.6,
  loop = false,
  children,
}: {
  target?: React.RefObject<Element | null> | string
  aesthetic?: 'roots' | 'lightning' | 'circuit'
  idleDelay?: number
  color?: string
  speed?: number
  maxDistance?: number
  duration?: number
  density?: number
  depth?: number
  curl?: number
  loop?: boolean
  children?: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const width = container.clientWidth
    const height = container.clientHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const state = {
      active: false,
      alpha: 0,
      branches: [] as Branch[],
      maxExtent: 1,
      grown: 0,
      holding: false,
      holdElapsed: 0,
      gen: 0,
    }
    const resolve = (): Element | null => {
      if (!target) return null
      if (typeof target === 'string') return document.querySelector(target)
      return target.current
    }

    let cursor: Point = { x: 0, y: 0 }
    let timer: ReturnType<typeof setTimeout> | undefined
    const arm = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        let bias: number | null = null
        const el = resolve()
        if (el) {
          const c = container.getBoundingClientRect()
          const t = el.getBoundingClientRect()
          bias = Math.atan2(t.top - c.top + t.height / 2 - cursor.y, t.left - c.left + t.width / 2 - cursor.x)
        }
        state.gen += 1
        const rng = createPrng(`branches:${state.gen}`)
        const branches = generate(aesthetic, rng, cursor, maxDistance, density, depth, curl, bias)
        state.branches = branches.map((b) => ({ ...b, length: length(b.points) }))
        state.maxExtent = state.branches.reduce((m, b) => Math.max(m, b.delay + b.length), 1)
        state.grown = 0
        state.holding = false
        state.holdElapsed = 0
        state.active = true
      }, idleDelay)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const rect = container.getBoundingClientRect()
      cursor = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      state.active = false
      arm()
    }
    const onLeave = () => {
      if (timer) clearTimeout(timer)
      state.active = false
    }
    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerleave', onLeave)
    arm()

    let raf = 0
    let last = 0
    const step = (ts: number) => {
      const dt = last === 0 ? 0 : (ts - last) / 1000
      last = ts
      state.alpha = state.active ? Math.min(1, state.alpha + dt / 0.3) : Math.max(0, state.alpha - dt / 0.3)
      ctx.clearRect(0, 0, width, height)
      if (state.alpha > 0 && state.branches.length) {
        if (state.holding) {
          state.holdElapsed += dt * 1000
          if (state.holdElapsed >= duration) {
            state.holding = false
            state.grown = 0
          }
        } else {
          state.grown += speed * dt
          if (state.grown >= state.maxExtent) {
            state.grown = state.maxExtent
            // Con loop re-crece; sin loop queda estático hasta moverse.
            if (loop) {
              state.holding = true
              state.holdElapsed = 0
            }
          }
        }
        ctx.strokeStyle = color
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.globalAlpha = state.alpha
        for (const b of state.branches) {
          const visible = state.grown - b.delay
          if (visible <= 0) continue
          ctx.lineWidth = Math.max(0.5, 2 * (b.width ?? 1))
          strokePartial(ctx, b.points, Math.min(visible, b.length))
        }
        ctx.globalAlpha = 1
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      if (timer) clearTimeout(timer)
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
    }
  }, [target, aesthetic, idleDelay, color, speed, maxDistance, duration, density, depth, curl, loop])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

export default function GuidingBranchesDemo() {
  // Modo ambient (sin target): el puntero pausado interactúa con su entorno,
  // expandiendo el trazo en todas direcciones hasta la frontera (maxDistance).
  return (
    <div style={{ width: '100%', height: '100vh', background: '#07120d' }}>
      <GuidingBranches aesthetic="roots" idleDelay={1200} color="#34d399" maxDistance={280} curl={0.7}>
        <div style={{ position: 'relative', height: '100vh', color: '#dfe', fontFamily: 'system-ui' }}>
          <p style={{ padding: 24 }}>Dejá el mouse quieto en cualquier lugar: el trazo crece a su alrededor.</p>
        </div>
      </GuidingBranches>
    </div>
  )
}
