// pixel-card.tsx — Card con grilla de píxeles (hover + idle) y efecto 3D tilt.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Versión simplificada de PixelBackground (behaviors hover + idle combinados
// aditivamente por frame) envuelta en un TiltCard básico con WAAPI.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de
// tipo inline (`: number`, `: string`).

import { useEffect, useRef } from 'react'

const CELL_SIZE = 10
const GAP = 2
const COLOR = '#7c3aed'
const BASE_OPACITY = 0.15
const HOVER_RADIUS = 110
const IDLE_INTENSITY = 0.25
const IDLE_SPEED = 1.5
const MAX_TILT = 10

// Offset de fase determinístico por celda, para que cada una parpadee a su ritmo.
function phaseOffset(col: number, row: number) {
  const seed = Math.sin(col * 127.1 + row * 311.7) * 43758.5453
  return (seed - Math.floor(seed)) * Math.PI * 2
}

function PixelCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const parent = canvas.parentElement

    let mouse = null
    let rafId = 0
    const start = performance.now()

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = parent.clientWidth * dpr
      canvas.height = parent.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const onLeave = () => {
      mouse = null
    }

    const draw = () => {
      const t = (performance.now() - start) / 1000
      const width = parent.clientWidth
      const height = parent.clientHeight
      const stride = CELL_SIZE + GAP
      const sigma = HOVER_RADIUS / 2

      ctx.clearRect(0, 0, width, height)
      for (let row = 0; row * stride < height; row++) {
        for (let col = 0; col * stride < width; col++) {
          const cx = col * stride + CELL_SIZE / 2
          const cy = row * stride + CELL_SIZE / 2

          // hover: brillo gaussiano según distancia al mouse
          let proximity = 0
          if (mouse) {
            const dx = cx - mouse.x
            const dy = cy - mouse.y
            proximity = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma))
          }
          // idle: parpadeo autónomo seeded por celda
          const idle = Math.sin(t * IDLE_SPEED + phaseOffset(col, row)) * IDLE_INTENSITY

          const alpha = Math.min(Math.max(BASE_OPACITY + proximity + idle, 0), 1)
          if (alpha <= 0) continue
          ctx.globalAlpha = alpha
          ctx.fillStyle = COLOR
          ctx.fillRect(col * stride, row * stride, CELL_SIZE, CELL_SIZE)
        }
      }
      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(draw)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(parent)
    parent.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseleave', onLeave)
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      parent.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}

export default function PixelCard() {
  const innerRef = useRef(null)
  const animRef = useRef(null)

  const tiltTo = (tiltX: number, tiltY: number) => {
    const el = innerRef.current
    if (!el || !el.animate) return
    if (animRef.current) {
      try {
        animRef.current.commitStyles()
      } catch {}
      animRef.current.cancel()
    }
    animRef.current = el.animate(
      [{ transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }],
      { duration: 150, fill: 'forwards', easing: 'ease-out' },
    )
  }

  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const relX = (event.clientX - rect.left) / rect.width - 0.5
    const relY = (event.clientY - rect.top) / rect.height - 0.5
    tiltTo(-relY * 2 * MAX_TILT, relX * 2 * MAX_TILT)
  }

  return (
    <div
      style={{ perspective: '1000px', width: 360 }}
      onMouseMove={onMove}
      onMouseLeave={() => tiltTo(0, 0)}
    >
      <div
        ref={innerRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 16,
          background: '#0b0b14',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          padding: '3rem 2rem',
          color: 'white',
          willChange: 'transform',
        }}
      >
        <PixelCanvas />
        <div style={{ position: 'relative' }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Pixel Card</h3>
          <p style={{ opacity: 0.7, marginBottom: 0 }}>
            Movés el mouse y la grilla se ilumina; las celdas parpadean solas mientras tanto.
          </p>
        </div>
      </div>
    </div>
  )
}
