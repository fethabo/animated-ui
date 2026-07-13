'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { createPrng, range } from '../../utils/prng'
import {
  computeGrid,
  createColumns,
  DEFAULT_CHARSET,
  pickGlyph,
  stepColumns,
} from './rain'
import type { MatrixRainProps } from './types'

export type { MatrixRainProps } from './types'

const CSS = `
.aui-matrix-rain {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-matrix-rain > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

/** Alpha de la veladura por frame: el trail se desvanece solo (patrón FlowField). */
const VEIL_ALPHA = 0.08
/** Filas por segundo a `speed = 1` (el multiplicador por columna la modula). */
const ROWS_PER_SECOND = 12
/** Fuente monospace del sistema (seteada una sola vez por efecto). */
const FONT_STACK = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

/**
 * Lluvia de glifos por columnas (code rain) sobre `<canvas>`: cada columna
 * dibuja un glifo nuevo en su cabeza brillante y una veladura semitransparente
 * del fondo desvanece los anteriores por frame — el trail es gratis, sin
 * buffer de historia. **Determinista por `seed`**: misma seed + tamaño ⇒
 * misma disposición y secuencia. La grilla deriva de `fontSize` (con cap de
 * columnas): subirlo baja la densidad — la palanca de performance.
 *
 * **Pinta su propio fondo** (`background`, no transparente): la veladura lo
 * requiere. Se posiciona `absolute, inset: 0` (o `fixed` para el viewport).
 * Con `prefers-reduced-motion` se pinta un frame estático de columnas
 * pre-dibujadas a distintas alturas, sin RAF.
 */
export function MatrixRain({
  seed = 'aui',
  charset = DEFAULT_CHARSET,
  color = '#22c55e',
  headColor = '#d9ffe3',
  background = '#040905',
  fontSize = 16,
  speed = 1,
  fixed = false,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: MatrixRainProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(containerRef)
  const isStatic = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('matrix-rain'), CSS)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = size.width || container.clientWidth
    const height = size.height || container.clientHeight
    if (width <= 0 || height <= 0) return

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Estética efectiva: overrides CSS (`--aui-matrix-*`) prevalecen sobre props.
    const computed = getComputedStyle(container)
    const effColor = computed.getPropertyValue('--aui-matrix-color').trim() || color
    const effHeadColor = computed.getPropertyValue('--aui-matrix-head-color').trim() || headColor
    const effBackground = computed.getPropertyValue('--aui-matrix-background').trim() || background

    const { columns: columnCount, rows } = computeGrid(width, height, fontSize)
    const columns = createColumns({ columns: columnCount, rows, seed })
    const glyphRng = createPrng(`${seed}:glyphs`)
    const stepRng = createPrng(`${seed}:step`)

    ctx.font = `${fontSize}px ${FONT_STACK}`
    ctx.textBaseline = 'top'

    // Fondo inicial opaco (el componente pinta su propio fondo).
    ctx.globalAlpha = 1
    ctx.fillStyle = effBackground
    ctx.fillRect(0, 0, width, height)

    const drawGlyph = (col: number, row: number, fill: string) => {
      ctx.fillStyle = fill
      ctx.fillText(pickGlyph(glyphRng, charset), col * fontSize, row * fontSize)
    }

    if (isStatic) {
      // Reduced motion: composición estática — cada columna pre-dibujada a la
      // altura de su cabeza, con la cola desvaneciéndose hacia arriba.
      const staticRng = createPrng(`${seed}:static`)
      for (let col = 0; col < columns.length; col++) {
        const head = Math.floor(columns[col].head)
        const trail = Math.round(range(staticRng, rows * 0.25, rows * 0.7))
        for (let k = 0; k < trail; k++) {
          const row = head - k
          if (row < 0) break
          ctx.globalAlpha = Math.max(0, 1 - k / trail)
          drawGlyph(col, row, k === 0 ? effHeadColor : effColor)
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

      // Veladura: desvanece los glifos anteriores sin buffer de historia.
      ctx.globalAlpha = VEIL_ALPHA
      ctx.fillStyle = effBackground
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = 1

      const crossed = stepColumns(columns, dt, {
        rows,
        rowsPerSecond: ROWS_PER_SECOND * speed,
        rng: stepRng,
      })
      for (let col = 0; col < columns.length; col++) {
        if (crossed[col] === 0) continue
        const head = Math.floor(columns[col].head)
        // La cabeza anterior baja a color de cola; la nueva brilla.
        drawGlyph(col, head - 1, effColor)
        drawGlyph(col, head, effHeadColor)
      }

      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [
    size.width,
    size.height,
    seed,
    charset,
    color,
    headColor,
    background,
    fontSize,
    speed,
    isStatic,
  ])

  return (
    <div
      ref={containerRef}
      className={`aui-matrix-rain${className ? ` ${className}` : ''}`}
      style={
        {
          ...(fixed ? { position: 'fixed' as const } : null),
          '--aui-matrix-color': color,
          '--aui-matrix-head-color': headColor,
          '--aui-matrix-background': background,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
