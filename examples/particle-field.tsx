// particle-field.tsx — Campo de partículas sobre canvas: repulsión al cursor,
// modos de deriva y líneas de conexión (constellation).
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Por default las partículas se mueven con velocidad aleatoria y rebotan en los
// bordes; dentro del radio del cursor reciben una fuerza proporcional a la
// proximidad (cursor-a-partícula, O(N)). `drift` cambia el carácter del
// movimiento (snow/embers/bubbles, con wrap por el borde opuesto). `links`
// dibuja líneas entre partículas cercanas y al cursor — cálculo entre pares
// O(N²) opt-in. El estado vive en un ref (array mutable que persiste entre
// frames), no en estado de React: el RAF no re-renderiza. Con
// prefers-reduced-motion el loop se detiene y se dibuja el estado inicial.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef, useState } from 'react'

type Cursor = 'repel' | 'attract' | 'none'
type Drift = 'bounce' | 'snow' | 'embers' | 'bubbles' | 'warp'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life?: number
}

const COLOR = '#7c3aed'
const LINK_COLOR = '#22d3ee'
const RADIUS = 2
const CURSOR_RADIUS = 120
const SPEED = 0.6
const LINK_DISTANCE = 120

const SWAY_FREQ = 0.02
const DRIFT_APPROACH = 0.05
const EMBER_DECAY = 0.004
const WARP_FALL_BASE = 0.6
const WARP_FALL_GAIN = 3
const WARP_SPREAD_GAIN = 4

// Hash determinista [0,1): distribuye los reingresos de warp a lo ancho del plano.
function hash01(seed: number) {
  const s = Math.sin(seed) * 43758.5453
  return s - Math.floor(s)
}

function ParticleField({
  count,
  cursorInteraction,
  drift,
  links,
}: {
  count: number
  cursorInteraction: Cursor
  drift: Drift
  links: boolean
}) {
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

    particlesRef.current = Array.from({ length: count }, () => {
      const p: Particle = {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() * 2 - 1) * SPEED,
        vy: (Math.random() * 2 - 1) * SPEED,
      }
      if (drift === 'snow') p.vy = Math.random() * SPEED
      else if (drift === 'embers') {
        p.vy = -Math.random() * SPEED
        p.life = Math.random()
      } else if (drift === 'bubbles') p.vy = -Math.random() * SPEED
      return p
    })

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Líneas de conexión detrás de las partículas (solo si links está activo).
      if (links) {
        const ps = particlesRef.current
        const cursor = cursorRef.current
        ctx.strokeStyle = LINK_COLOR
        ctx.lineWidth = 1
        for (let i = 0; i < ps.length; i++) {
          const a = ps[i]
          for (let j = i + 1; j < ps.length; j++) {
            const b = ps[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            if (dx > LINK_DISTANCE || dx < -LINK_DISTANCE || dy > LINK_DISTANCE || dy < -LINK_DISTANCE) continue
            const distSq = dx * dx + dy * dy
            if (distSq >= LINK_DISTANCE * LINK_DISTANCE) continue
            ctx.globalAlpha = 1 - Math.sqrt(distSq) / LINK_DISTANCE
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
          if (cursor) {
            const dx = a.x - cursor.x
            const dy = a.y - cursor.y
            const distSq = dx * dx + dy * dy
            if (distSq < LINK_DISTANCE * LINK_DISTANCE) {
              ctx.globalAlpha = 1 - Math.sqrt(distSq) / LINK_DISTANCE
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(cursor.x, cursor.y)
              ctx.stroke()
            }
          }
        }
        ctx.globalAlpha = 1
      }

      ctx.fillStyle = COLOR
      const fade = drift === 'embers'
      for (const p of particlesRef.current) {
        if (fade) ctx.globalAlpha = p.life ?? 1
        ctx.beginPath()
        ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }
      if (fade) ctx.globalAlpha = 1
    }

    if (reduce) {
      draw()
      return
    }

    let raf = 0
    const step = () => {
      const cursor = cursorRef.current
      for (const p of particlesRef.current) {
        // Deriva del modo: relaja la velocidad hacia la velocidad terminal.
        if (drift === 'warp') {
          // Campo de estrellas: nacen en todo el borde superior, caen acelerando
          // en perspectiva y se abren hacia los costados al descender.
          const cx = width / 2
          const depth = Math.max(0, p.y) / height
          p.vy = SPEED * (WARP_FALL_BASE + depth * WARP_FALL_GAIN)
          p.vx = ((p.x - cx) / cx) * SPEED * depth * WARP_SPREAD_GAIN
        } else if (drift !== 'bounce') {
          const sway = Math.sin(p.y * SWAY_FREQ) * SPEED
          let tvx = 0
          let tvy = 0
          if (drift === 'snow') {
            tvx = sway * 0.6
            tvy = SPEED * 1.5
          } else if (drift === 'embers') {
            tvx = sway * 0.4
            tvy = -SPEED * 1.5
            p.life = (p.life ?? 1) - EMBER_DECAY
            if (p.life <= 0) {
              p.life = 1
              p.y = height
            }
          } else if (drift === 'bubbles') {
            tvx = sway * 1.2
            tvy = -SPEED * 1.8
          }
          p.vx += (tvx - p.vx) * DRIFT_APPROACH
          p.vy += (tvy - p.vy) * DRIFT_APPROACH
        }

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

        if (drift === 'bounce') {
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
        } else if (drift === 'warp') {
          // Renace en el borde superior, a lo ancho de todo el plano.
          if (p.x < 0 || p.x > width || p.y > height) {
            p.x = hash01(p.x * 12.9898 + p.y * 78.233) * width
            p.y = 0
          }
        } else {
          // Modos direccionales: wrap por el borde opuesto.
          if (p.x < 0) p.x = width
          else if (p.x > width) p.x = 0
          if (p.y < 0) p.y = height
          else if (p.y > height) p.y = 0
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
  }, [count, cursorInteraction, drift, links])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

export default function ParticleFieldDemo() {
  const [count, setCount] = useState(100)
  const [cursorInteraction, setCursorInteraction] = useState<Cursor>('repel')
  const [drift, setDrift] = useState<Drift>('bounce')
  const [links, setLinks] = useState(true)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#050510' }}>
      <ParticleField count={count} cursorInteraction={cursorInteraction} drift={drift} links={links} />
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
          Deriva
          <select value={drift} onChange={(e) => setDrift(e.target.value as Drift)}>
            <option value="bounce">bounce</option>
            <option value="snow">snow</option>
            <option value="embers">embers</option>
            <option value="bubbles">bubbles</option>
            <option value="warp">warp</option>
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          Cursor
          <select value={cursorInteraction} onChange={(e) => setCursorInteraction(e.target.value as Cursor)}>
            <option value="repel">repel</option>
            <option value="attract">attract</option>
            <option value="none">none</option>
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={links} onChange={(e) => setLinks(e.target.checked)} />
          Líneas (constellation)
        </label>
      </div>
    </div>
  )
}
