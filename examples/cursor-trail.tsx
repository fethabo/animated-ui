// cursor-trail.tsx — Estela de partículas que sigue al puntero sobre un
// canvas overlay pointer-events: none.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// El movimiento del mouse emite partículas solo cuando el recorrido acumulado
// supera un umbral (EMIT_EVERY px): un movimiento rápido emite puntos
// interpolados equiespaciados, uno corto no emite nada. Cada partícula vive
// unos ms con deriva leve y fade; el RAF corre solo mientras hay partículas
// vivas. Con prefers-reduced-motion el efecto se desactiva por completo.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const COLOR = '#7c3aed'
const SIZE = 8 // diámetro base en px
const LIFE = 0.6 // segundos
const EMIT_EVERY = 12 // px de recorrido entre emisiones

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  radius: number
}

export default function CursorTrailDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = Math.max(1, Math.round(container.clientWidth * dpr))
      canvas.height = Math.max(1, Math.round(container.clientHeight * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)

    const particles: Particle[] = []
    let last: { x: number; y: number } | null = null
    let traveled = 0
    let rafId = 0
    let running = false
    let lastTs = 0

    const loop = (ts: number) => {
      const dt = lastTs === 0 ? 0 : Math.min(0.05, (ts - lastTs) / 1000)
      lastTs = ts
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life -= dt
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        p.x += p.vx * dt
        p.y += p.vy * dt
      }
      ctx.clearRect(0, 0, container.clientWidth, container.clientHeight)
      if (particles.length === 0) {
        running = false
        return // el loop se apaga solo sin estela viva
      }
      for (const p of particles) {
        ctx.globalAlpha = p.life / LIFE
        ctx.fillStyle = COLOR
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(loop)
    }

    const spawn = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 30
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: LIFE,
        radius: (SIZE / 2) * (0.5 + Math.random() * 0.5),
      })
      if (!running) {
        running = true
        lastTs = 0
        rafId = requestAnimationFrame(loop)
      }
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = container.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (!last) {
        last = { x, y }
        return
      }
      const dx = x - last.x
      const dy = y - last.y
      const dist = Math.hypot(dx, dy)
      // Emisión por umbral de distancia, con puntos interpolados en el segmento.
      let offset = EMIT_EVERY - traveled
      while (offset <= dist) {
        const t = offset / dist
        spawn(last.x + dx * t, last.y + dy * t)
        offset += EMIT_EVERY
      }
      traveled = (traveled + dist) % EMIT_EVERY
      last = { x, y }
    }
    const onLeave = () => {
      last = null
      traveled = 0
    }

    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerleave', onLeave)
    return () => {
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: 400,
        background: '#0f0f1a',
        color: '#e2e8f0',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'system-ui',
      }}
    >
      <p>Movete por acá</p>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
