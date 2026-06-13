// particle-field.tsx — Campo de partículas sobre canvas con repulsión al cursor.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Las partículas se mueven con velocidad aleatoria y rebotan en los bordes;
// dentro del radio del cursor reciben una fuerza proporcional a la proximidad
// (cursor-a-partícula, O(N)). El estado de las partículas vive en un ref (array
// mutable que persiste entre frames), no en estado de React: el RAF no
// re-renderiza. Con prefers-reduced-motion el loop se detiene y se dibuja el
// estado inicial estático.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef, useState } from 'react'

type Cursor = 'repel' | 'attract' | 'none'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

const COLOR = '#7c3aed'
const RADIUS = 2
const CURSOR_RADIUS = 120
const SPEED = 0.4

function ParticleField({ count, cursorInteraction }: { count: number; cursorInteraction: Cursor }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const cursorRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = container.clientWidth
    let height = container.clientHeight
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() * 2 - 1) * SPEED,
      vy: (Math.random() * 2 - 1) * SPEED,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = COLOR
      for (const p of particlesRef.current) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    if (reduce) {
      draw()
      return
    }

    let raf = 0
    const step = () => {
      const cursor = cursorRef.current
      for (const p of particlesRef.current) {
        if (cursor && cursorInteraction !== 'none') {
          const dx = p.x - cursor.x
          const dy = p.y - cursor.y
          const dist = Math.hypot(dx, dy)
          if (dist > 0 && dist < CURSOR_RADIUS) {
            const proximity = 1 - dist / CURSOR_RADIUS
            const strength = proximity * proximity * 0.6
            const sign = cursorInteraction === 'repel' ? 1 : -1
            p.vx += (dx / dist) * strength * sign
            p.vy += (dy / dist) * strength * sign
          }
        }
        const max = SPEED * 6
        p.vx = Math.max(-max, Math.min(max, p.vx))
        p.vy = Math.max(-max, Math.min(max, p.vy))
        p.x += p.vx
        p.y += p.vy
        if (p.x < RADIUS) {
          p.x = RADIUS
          p.vx = Math.abs(p.vx)
        } else if (p.x > width - RADIUS) {
          p.x = width - RADIUS
          p.vx = -Math.abs(p.vx)
        }
        if (p.y < RADIUS) {
          p.y = RADIUS
          p.vy = Math.abs(p.vy)
        } else if (p.y > height - RADIUS) {
          p.y = height - RADIUS
          p.vy = -Math.abs(p.vy)
        }
      }
      draw()
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const rect = container.getBoundingClientRect()
      cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => {
      cursorRef.current = null
    }
    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [count, cursorInteraction])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

export default function ParticleFieldDemo() {
  const [count, setCount] = useState(60)
  const [cursorInteraction, setCursorInteraction] = useState<Cursor>('repel')

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#050510' }}>
      <ParticleField count={count} cursorInteraction={cursorInteraction} />
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          padding: '1rem',
          borderRadius: 12,
          background: 'rgba(18,18,31,0.85)',
          color: '#eee',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontFamily: 'system-ui',
        }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          Partículas: {count}
          <input
            type="range"
            min={10}
            max={200}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          Cursor
          <select value={cursorInteraction} onChange={(e) => setCursorInteraction(e.target.value as Cursor)}>
            <option value="repel">repel</option>
            <option value="attract">attract</option>
            <option value="none">none</option>
          </select>
        </label>
      </div>
    </div>
  )
}
