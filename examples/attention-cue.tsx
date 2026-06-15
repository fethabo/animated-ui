// attention-cue.tsx — Director de atención simple: tras inactividad del mouse,
// dispara un DESTELLO de luz que viaja desde el cursor hacia un target (modo
// directed, con punta de flecha) o irradiando alrededor (ambient). Por default
// muestra solo la luz (cometa con glow que aparece y se desvanece); el trazo
// puede curvarse y la punta cambiarse. Overlay pointer-events:none (clicks
// pasan). Se desactiva con prefers-reduced-motion (efecto autónomo).
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

type Point = { x: number; y: number }
type Head = 'arrow' | 'dot' | 'none'
type Marker = 'beam' | 'footprints'
type Ray = { path: Point[]; length: number; endAngle: number }

function len(points: Point[]) {
  let t = 0
  for (let i = 1; i < points.length; i++) t += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
  return t
}
function pointAt(points: Point[], distance: number): Point {
  if (distance <= 0) return points[0]
  let remaining = distance
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const segLen = Math.hypot(b.x - a.x, b.y - a.y)
    if (remaining <= segLen) {
      const t = remaining / segLen
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    }
    remaining -= segLen
  }
  return points[points.length - 1]
}
// Bezier cúbica con el segundo control sobre el eje recto: el trazo se arquea
// pero llega apuntando exacto al destino (la punta siempre mira al ref).
function buildPath(origin: Point, angle: number, length: number, curve: number, sign: number): Point[] {
  const ux = Math.cos(angle)
  const uy = Math.sin(angle)
  const end = { x: origin.x + ux * length, y: origin.y + uy * length }
  if (curve <= 0) return [origin, end]
  const px = Math.cos(angle + Math.PI / 2)
  const py = Math.sin(angle + Math.PI / 2)
  const off = curve * length * 0.5 * sign
  const c1 = { x: origin.x + ux * length * 0.33 + px * off, y: origin.y + uy * length * 0.33 + py * off }
  const c2 = { x: end.x - ux * length * 0.33, y: end.y - uy * length * 0.33 }
  const pts: Point[] = []
  for (let i = 0; i <= 18; i++) {
    const t = i / 18
    const u = 1 - t
    pts.push({
      x: u * u * u * origin.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * end.x,
      y: u * u * u * origin.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * end.y,
    })
  }
  return pts
}
function makeRay(path: Point[]): Ray {
  const a = path[path.length - 2]
  const b = path[path.length - 1]
  return { path, length: len(path), endAngle: Math.atan2(b.y - a.y, b.x - a.x) }
}

function AttentionCue({
  target,
  idleDelay = 2000,
  color = '#fbbf24',
  speed = 420,
  maxDistance = 220,
  duration = 700,
  lineWidth = 3,
  head = 'arrow',
  marker = 'beam',
  curve = 0,
  showGuide = false,
  children,
}: {
  target?: React.RefObject<Element | null> | string
  idleDelay?: number
  color?: string
  speed?: number
  maxDistance?: number
  duration?: number
  lineWidth?: number
  head?: Head
  marker?: Marker
  curve?: number
  showGuide?: boolean
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

    const state = { active: false, alpha: 0, rays: [] as Ray[], sweep: 0, holding: false, holdElapsed: 0 }
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
        state.sweep = 0
        state.holding = false
        state.holdElapsed = 0
        const el = resolve()
        if (el) {
          const c = container.getBoundingClientRect()
          const t = el.getBoundingClientRect()
          const dx = t.left - c.left + t.width / 2 - cursor.x
          const dy = t.top - c.top + t.height / 2 - cursor.y
          state.rays = [makeRay(buildPath(cursor, Math.atan2(dy, dx), Math.min(Math.hypot(dx, dy), maxDistance), curve, 1))]
        } else {
          state.rays = Array.from({ length: 8 }, (_, i) =>
            makeRay(buildPath(cursor, (i / 8) * Math.PI * 2, maxDistance * 0.6, curve, i % 2 ? 1 : -1)),
          )
        }
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

    const drawHead = (ray: Ray, alpha: number) => {
      if (head === 'none') return
      const tip = ray.path[ray.path.length - 1]
      ctx.globalAlpha = alpha
      if (head === 'dot') {
        ctx.beginPath()
        ctx.arc(tip.x, tip.y, lineWidth * 1.6, 0, Math.PI * 2)
        ctx.fill()
        return
      }
      const s = lineWidth * 4
      ctx.beginPath()
      ctx.moveTo(tip.x, tip.y)
      ctx.lineTo(tip.x - Math.cos(ray.endAngle - 0.5) * s, tip.y - Math.sin(ray.endAngle - 0.5) * s)
      ctx.lineTo(tip.x - Math.cos(ray.endAngle + 0.5) * s, tip.y - Math.sin(ray.endAngle + 0.5) * s)
      ctx.closePath()
      ctx.fill()
    }

    let raf = 0
    let last = 0
    const loop = (ts: number) => {
      const dt = last === 0 ? 0 : (ts - last) / 1000
      last = ts
      state.alpha = state.active ? Math.min(1, state.alpha + dt / 0.25) : Math.max(0, state.alpha - dt / 0.25)
      ctx.clearRect(0, 0, width, height)
      if (state.alpha > 0 && state.rays.length) {
        const maxLen = Math.max(...state.rays.map((r) => r.length), 1)
        let flash = 1
        if (state.holding) {
          state.holdElapsed += dt * 1000
          flash = Math.max(0, 1 - state.holdElapsed / duration)
          if (state.holdElapsed >= duration) {
            state.holding = false
            state.sweep = 0
          }
        } else {
          state.sweep += speed * dt
          if (state.sweep >= maxLen) {
            state.sweep = maxLen
            state.holding = true
            state.holdElapsed = 0
          }
        }
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineWidth = lineWidth
        ctx.lineCap = 'round'
        for (const ray of state.rays) {
          const a = state.alpha * flash
          if (showGuide) {
            ctx.globalAlpha = state.alpha * 0.16
            ctx.beginPath()
            ctx.moveTo(ray.path[0].x, ray.path[0].y)
            for (let i = 1; i < ray.path.length; i++) ctx.lineTo(ray.path[i].x, ray.path[i].y)
            ctx.stroke()
          }
          const d = Math.min(state.sweep, ray.length)
          ctx.shadowColor = color
          ctx.shadowBlur = lineWidth * 4
          if (marker === 'footprints') {
            const footSpacing = lineWidth * 8
            const count = Math.floor(ray.length / footSpacing)
            for (let i = 1; i <= count; i++) {
              const fd = i * footSpacing
              if (fd > d) break
              const p = pointAt(ray.path, fd)
              const ahead = pointAt(ray.path, Math.min(fd + 1, ray.length))
              const ang = Math.atan2(ahead.y - p.y, ahead.x - p.x)
              const side = i % 2 ? 1 : -1
              const off = lineWidth * 1.5
              const recency = 1 - (d - fd) / Math.max(1, ray.length)
              ctx.globalAlpha = a * (0.35 + 0.65 * recency)
              ctx.save()
              ctx.translate(p.x + Math.cos(ang + Math.PI / 2) * off * side, p.y + Math.sin(ang + Math.PI / 2) * off * side)
              ctx.rotate(ang) // +x local = sentido de avance (hacia el destino)
              ctx.beginPath() // suela adelante (hacia el destino)
              ctx.ellipse(0, 0, lineWidth * 2, lineWidth * 1.1, 0, 0, Math.PI * 2)
              ctx.fill()
              ctx.beginPath() // dedito atrás, así la huella "avanza"
              ctx.ellipse(-lineWidth * 2.4, 0, lineWidth * 0.8, lineWidth * 0.7, 0, 0, Math.PI * 2)
              ctx.fill()
              ctx.restore()
            }
          } else {
            for (let k = 12; k >= 0; k--) {
              const dd = d - (k / 12) * 30
              if (dd < 0) continue
              const fade = 1 - k / 12
              const p = pointAt(ray.path, dd)
              ctx.globalAlpha = a * fade * fade
              ctx.beginPath()
              ctx.arc(p.x, p.y, lineWidth * (0.5 + fade * 0.6), 0, Math.PI * 2)
              ctx.fill()
            }
          }
          drawHead(ray, a * Math.min(1, state.sweep / ray.length))
          ctx.shadowBlur = 0
        }
        ctx.globalAlpha = 1
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      if (timer) clearTimeout(timer)
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
    }
  }, [target, idleDelay, color, speed, maxDistance, duration, lineWidth, head, marker, curve, showGuide])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

export default function AttentionCueDemo() {
  const ctaRef = useRef<HTMLButtonElement>(null)
  return (
    <div style={{ width: '100%', height: '100vh', background: '#0b0b12' }}>
      <AttentionCue target={ctaRef} idleDelay={1800} color="#fbbf24" maxDistance={260} curve={0.3}>
        <div style={{ position: 'relative', height: '100vh', color: '#eee', fontFamily: 'system-ui' }}>
          <p style={{ padding: 24 }}>Dejá el mouse quieto unos segundos…</p>
          <button
            ref={ctaRef}
            style={{ position: 'absolute', right: 80, bottom: 100, padding: '12px 20px', borderRadius: 10 }}
          >
            Empezá acá
          </button>
        </div>
      </AttentionCue>
    </div>
  )
}
