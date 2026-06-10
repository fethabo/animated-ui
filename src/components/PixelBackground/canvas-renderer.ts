import type { CellColorFn, PixelBehavior, PixelCell, PixelFrameContext } from './types'

export interface PixelRendererOptions {
  cellSize: number
  gap: number
  color: string
  cellColor?: CellColorFn
  baseOpacity: number
  behaviors: PixelBehavior[]
}

/**
 * Renderer puro (sin React) de la grilla de píxeles.
 *
 * Maneja la grilla de celdas, el loop de `requestAnimationFrame`, la
 * composición de behaviors por frame, y el dibujado en canvas con soporte
 * de devicePixelRatio. El componente React lo instancia y le pushea
 * tamaño y posición del mouse.
 *
 * Composición por frame y por celda:
 *   alpha = clamp(baseOpacity + Σ brightness, 0, 1) × Π opacity
 * donde los behaviors `mode: 'brightness'` (hover, idle) suman y los
 * `mode: 'opacity'` (reveal) multiplican.
 */
export class PixelCanvasRenderer {
  private canvas: HTMLCanvasElement
  private ctx2d: CanvasRenderingContext2D | null
  private options: PixelRendererOptions

  private width = 0
  private height = 0
  private cols = 0
  private rows = 0
  private cells: PixelCell[] = []

  private mouse: { x: number; y: number } | null = null
  private rafId: number | null = null
  private startTimestamp: number | null = null
  private lastTimestamp: number | null = null

  constructor(canvas: HTMLCanvasElement, options: PixelRendererOptions) {
    this.canvas = canvas
    this.ctx2d = canvas.getContext('2d')
    this.options = options
  }

  /** Redimensiona el canvas (en px CSS) y reconstruye la grilla. */
  setSize(width: number, height: number): void {
    this.width = width
    this.height = height

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    this.canvas.width = Math.max(1, Math.round(width * dpr))
    this.canvas.height = Math.max(1, Math.round(height * dpr))
    this.ctx2d?.setTransform(dpr, 0, 0, dpr, 0, 0)

    this.rebuildGrid()
    // Si no hay loop corriendo (sin behaviors), redibuja el estado estático.
    if (this.rafId === null) this.drawFrame(0, 0)
  }

  /** Posición del mouse relativa al canvas, o `null` si está afuera. */
  setMouse(mouse: { x: number; y: number } | null): void {
    this.mouse = mouse
  }

  /** Arranca el loop de rAF; si no hay behaviors, dibuja un único frame estático. */
  start(): void {
    if (this.rafId !== null) return
    if (this.options.behaviors.length === 0) {
      this.drawFrame(0, 0)
      return
    }
    const loop = (timestamp: number) => {
      if (this.startTimestamp === null) this.startTimestamp = timestamp
      const time = (timestamp - this.startTimestamp) / 1000
      const delta = this.lastTimestamp === null ? 0 : (timestamp - this.lastTimestamp) / 1000
      this.lastTimestamp = timestamp
      this.drawFrame(time, delta)
      this.rafId = requestAnimationFrame(loop)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  /** Detiene el loop de rAF sin destruir el estado. */
  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.lastTimestamp = null
  }

  /** Cancela el rAF y suelta referencias. Llamar en unmount. */
  destroy(): void {
    this.stop()
    this.cells = []
    this.ctx2d = null
  }

  private rebuildGrid(): void {
    const { cellSize, gap } = this.options
    const stride = cellSize + gap
    this.cols = Math.max(0, Math.ceil(this.width / stride))
    this.rows = Math.max(0, Math.ceil(this.height / stride))

    this.cells = []
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = col * stride
        const y = row * stride
        this.cells.push({
          col,
          row,
          x,
          y,
          centerX: x + cellSize / 2,
          centerY: y + cellSize / 2,
        })
      }
    }
  }

  private drawFrame(time: number, delta: number): void {
    const ctx = this.ctx2d
    if (!ctx) return

    const { cellSize, gap, color, cellColor, baseOpacity, behaviors } = this.options
    const frame: PixelFrameContext = {
      time,
      delta,
      mouse: this.mouse,
      cols: this.cols,
      rows: this.rows,
      cellSize,
      gap,
    }

    for (const behavior of behaviors) behavior.frame?.(frame)

    ctx.clearRect(0, 0, this.width, this.height)

    for (const cell of this.cells) {
      let brightness = 0
      let opacity = 1
      let proximity = 0
      let idlePhase = 0

      for (const behavior of behaviors) {
        const contribution = behavior.cell(cell, frame)
        if (behavior.mode === 'brightness') {
          brightness += contribution
          if (behavior.name === 'hover') proximity = contribution
          if (behavior.name === 'idle') idlePhase = contribution
        } else {
          opacity *= contribution
        }
      }

      const alpha = Math.min(Math.max(baseOpacity + brightness, 0), 1) * opacity
      if (alpha <= 0) continue

      ctx.globalAlpha = alpha
      ctx.fillStyle = cellColor ? cellColor(cell.col, cell.row, proximity, idlePhase) : color
      ctx.fillRect(cell.x, cell.y, cellSize, cellSize)
    }
    ctx.globalAlpha = 1
  }
}
