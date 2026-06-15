// tesla-coil.tsx — Bobina de Tesla sobre canvas: un nodo central que arroja
// rayos jagged (midpoint-displacement seedado) hacia afuera, regenerándose; en
// hover dirige un rayo al cursor (tracking por ref, sin re-renders). El canvas
// es pointer-events:none, así los children quedan interactivos.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

type Point = { x: number; y: number }

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
const range = (rng: () => number, min: number, max: number) => min + rng() * (max - min)

// Rayo jagged entre dos puntos por subdivisión de punto medio.
function jaggedBolt(rng: () => number, from: Point, to: Point, jitter: number, detail = 4): Point[] {
  let points: Point[] = [from, to]
  let amp = jitter
  for (let d = 0; d < detail; d++) {
    const next: Point[] = [points[0]]
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1]
      const b = points[i]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const len = Math.hypot(dx, dy) || 1
      const off = (rng() * 2 - 1) * amp
      next.push({ x: (a.x + b.x) / 2 + (-dy / len) * off, y: (a.y + b.y) / 2 + (dx / len) * off })
      next.push(b)
    }
    points = next
    amp *= 0.5
  }
  return points
}

function TeslaCoil({
  color,
  boltCount,
  reach,
  jitter,
  cursorTrigger = 'hover',
  children,
}: {
  color: string
  boltCount: number
  reach: number
  jitter: number
  cursorTrigger?: 'hover' | 'click'
  children?: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<Point | null>(null)
  const pressedRef = useRef(false)

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

    const center = { x: width / 2, y: height / 2 }
    const rng = createPrng('tesla')

    const generateAmbient = () => {
      const bolts: Point[][] = []
      for (let i = 0; i < boltCount; i++) {
        const angle = (i / boltCount) * Math.PI * 2 + range(rng, -0.35, 0.35)
        const len = reach * range(rng, 0.6, 1)
        bolts.push(
          jaggedBolt(rng, center, { x: center.x + Math.cos(angle) * len, y: center.y + Math.sin(angle) * len }, jitter),
        )
      }
      return bolts
    }

    // Varios rayos al cursor (regenerados por frame), todos al MISMO punto: el
    // cursor. Divergen en el medio y convergen en el puntero.
    const generateCursor = (cursor: Point) => {
      const bolts: Point[][] = []
      for (let i = 0; i < 3; i++) bolts.push(jaggedBolt(rng, center, cursor, jitter))
      return bolts
    }

    const stroke = (bolts: Point[][], lineWidth: number, glow: number, core: boolean) => {
      ctx.strokeStyle = color
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.shadowColor = color
      ctx.shadowBlur = glow
      ctx.lineWidth = lineWidth
      for (const bolt of bolts) {
        ctx.beginPath()
        ctx.moveTo(bolt[0].x, bolt[0].y)
        for (let i = 1; i < bolt.length; i++) ctx.lineTo(bolt[i].x, bolt[i].y)
        ctx.stroke()
      }
      if (core) {
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.shadowBlur = glow * 0.5
        ctx.lineWidth = Math.max(1, lineWidth * 0.4)
        for (const bolt of bolts) {
          ctx.beginPath()
          ctx.moveTo(bolt[0].x, bolt[0].y)
          for (let i = 1; i < bolt.length; i++) ctx.lineTo(bolt[i].x, bolt[i].y)
          ctx.stroke()
        }
      }
      ctx.shadowBlur = 0
    }

    const draw = (ambient: Point[][]) => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalAlpha = 0.8
      stroke(ambient, 2, 10, false)
      ctx.globalAlpha = 1
      const cursor = cursorRef.current
      const showCursor = cursor && (cursorTrigger === 'hover' || pressedRef.current)
      if (showCursor) stroke(generateCursor(cursor), 3.8, 22, true)
    }

    const setCursor = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      setCursor(e)
    }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      setCursor(e)
      pressedRef.current = true
    }
    const onUp = () => (pressedRef.current = false)
    const onLeave = () => {
      cursorRef.current = null
      pressedRef.current = false
    }
    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerdown', onDown)
    container.addEventListener('pointerup', onUp)
    container.addEventListener('pointercancel', onUp)
    container.addEventListener('pointerleave', onLeave)

    const cleanupEvents = () => {
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerdown', onDown)
      container.removeEventListener('pointerup', onUp)
      container.removeEventListener('pointercancel', onUp)
      container.removeEventListener('pointerleave', onLeave)
    }

    if (reduce) {
      draw(generateAmbient())
      return cleanupEvents
    }

    const interval = 1000 / 12
    let ambient = generateAmbient()
    let lastRegen = 0
    let raf = 0
    const loop = (ts: number) => {
      if (lastRegen === 0) lastRegen = ts
      if (ts - lastRegen >= interval) {
        ambient = generateAmbient()
        lastRegen = ts
      }
      draw(ambient)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      cleanupEvents()
    }
  }, [color, boltCount, reach, jitter, cursorTrigger])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

export default function TeslaCoilDemo() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100vh', background: '#05060f' }}>
      <div style={{ width: 520, height: 420 }}>
        <TeslaCoil color="#7dd3fc" boltCount={9} reach={200} jitter={18}>
          {/* El botón va abajo para no tapar el nodo central ni los rayos. */}
          <div style={{ height: 420, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 20 }}>
            <button style={{ padding: '10px 18px', borderRadius: 10 }}>Cargar</button>
          </div>
        </TeslaCoil>
      </div>
    </div>
  )
}
