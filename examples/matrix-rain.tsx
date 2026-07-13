// matrix-rain.tsx — Lluvia de glifos cayendo por columnas (code rain),
// seedable y determinista.
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Incluye un PRNG seedable mínimo inline. Cada columna es un cursor vertical
// con velocidad propia: por frame se dibuja el glifo nuevo de la cabeza
// (color brillante) y una veladura semitransparente del fondo desvanece los
// anteriores — el trail sale gratis, sin buffer de historia. Al salir por
// abajo la columna reinicia desde arriba tras un delay pseudoaleatorio. La
// grilla deriva de FONT_SIZE: subirlo baja la densidad (performance). Con
// prefers-reduced-motion se pinta un frame estático de columnas.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef } from 'react'

const SEED = 'matrix'
const CHARSET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノ'
const COLOR = '#22c55e'
const HEAD_COLOR = '#d9ffe3'
const BACKGROUND = '#040905'
const FONT_SIZE = 16
const ROWS_PER_SECOND = 12

// --- PRNG seedable mínimo (xmur3 + mulberry32) ---
function createPrng(seed: string): () => number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = (h ^= h >>> 16) >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Column {
  head: number // fila fraccional de la cabeza
  speed: number
  delay: number // segundos antes de (re)arrancar
}

export default function MatrixRainDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = container.clientWidth
    const height = container.clientHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const columnCount = Math.min(400, Math.max(1, Math.floor(width / FONT_SIZE)))
    const rows = Math.max(1, Math.ceil(height / FONT_SIZE))
    const rng = createPrng(`${SEED}:${columnCount}x${rows}`)
    const columns: Column[] = Array.from({ length: columnCount }, () => {
      const waiting = rng() < 0.3
      return {
        head: waiting ? 0 : rng() * rows,
        speed: 0.6 + rng(),
        delay: waiting ? 0.2 + rng() * 2 : 0,
      }
    })

    ctx.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
    ctx.textBaseline = 'top'
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, width, height)

    const glyph = () => CHARSET[Math.floor(rng() * CHARSET.length)]
    const drawGlyph = (col: number, row: number, fill: string) => {
      ctx.fillStyle = fill
      ctx.fillText(glyph(), col * FONT_SIZE, row * FONT_SIZE)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Frame estático: columnas pre-dibujadas a distintas alturas con fade.
      for (let col = 0; col < columns.length; col++) {
        const head = Math.floor(columns[col].head)
        const trail = Math.round(rows * (0.25 + rng() * 0.45))
        for (let k = 0; k < trail; k++) {
          const row = head - k
          if (row < 0) break
          ctx.globalAlpha = Math.max(0, 1 - k / trail)
          drawGlyph(col, row, k === 0 ? HEAD_COLOR : COLOR)
        }
      }
      ctx.globalAlpha = 1
      return
    }

    let rafId = 0
    let last = 0
    const loop = (ts: number) => {
      const dt = last === 0 ? 0 : (ts - last) / 1000
      last = ts

      // Veladura: desvanece los glifos anteriores.
      ctx.globalAlpha = 0.08
      ctx.fillStyle = BACKGROUND
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = 1

      for (const [col, column] of columns.entries()) {
        if (column.delay > 0) {
          column.delay -= dt
          continue
        }
        const before = Math.floor(column.head)
        column.head += column.speed * ROWS_PER_SECOND * dt
        const head = Math.floor(column.head)
        if (head > before) {
          drawGlyph(col, head - 1, COLOR) // la cabeza anterior baja a color de cola
          drawGlyph(col, head, HEAD_COLOR)
        }
        if (column.head >= rows) {
          column.head = 0
          column.speed = 0.6 + rng()
          column.delay = 0.2 + rng() * 2 // reinicio con delay pseudoaleatorio
        }
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative', height: 400 }}>
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
