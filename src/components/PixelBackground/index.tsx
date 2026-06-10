'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useMousePosition } from '../../hooks/useMousePosition'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import { PixelCanvasRenderer } from './canvas-renderer'
import { createHoverBehavior } from './behaviors/hover'
import { createIdleBehavior } from './behaviors/idle'
import { createRevealBehavior } from './behaviors/reveal'
import type { BehaviorName, PixelBackgroundProps, PixelBehavior } from './types'

export type {
  BehaviorName,
  CellColorFn,
  PixelBackgroundProps,
  PixelBehavior,
  PixelCell,
  PixelFrameContext,
} from './types'

/**
 * Grilla de píxeles animada sobre `<canvas>`, con behaviors combinables:
 * `hover` (iluminación por proximidad al mouse), `idle` (parpadeo autónomo)
 * y `reveal` (materialización dithered al montar).
 *
 * El canvas cubre el contenedor y se adapta a su tamaño automáticamente.
 * Con `prefers-reduced-motion`, `idle` y `reveal` se desactivan; `hover`
 * sigue activo porque responde a input directo del usuario.
 */
export function PixelBackground({
  cellSize = 12,
  gap = 2,
  behaviors = ['hover'],
  color = '#7c3aed',
  cellColor,
  baseOpacity = 0.15,
  hoverRadius = 120,
  idleIntensity = 1,
  idleSpeed = 1.5,
  revealDuration = 1200,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: PixelBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<PixelCanvasRenderer | null>(null)

  const reducedMotion = useReducedMotion()
  const size = useResizeObserver(containerRef)
  const mouse = useMousePosition(containerRef)

  // Lista efectiva de behaviors: con reduced motion se filtran las
  // animaciones autónomas (idle, reveal) pero hover se mantiene.
  const behaviorKey = behaviors.join(',')
  const activeBehaviors = useMemo<PixelBehavior[]>(() => {
    const names = behaviorKey.split(',').filter(Boolean) as BehaviorName[]
    const filtered =
      respectReducedMotion && reducedMotion
        ? names.filter((name) => name === 'hover')
        : names

    return filtered.map((name) => {
      switch (name) {
        case 'hover':
          return createHoverBehavior({ radius: hoverRadius })
        case 'idle':
          return createIdleBehavior({ intensity: idleIntensity, speed: idleSpeed })
        case 'reveal':
          return createRevealBehavior({ duration: revealDuration })
      }
    })
  }, [
    behaviorKey,
    respectReducedMotion,
    reducedMotion,
    hoverRadius,
    idleIntensity,
    idleSpeed,
    revealDuration,
  ])

  // Crea/destruye el renderer. El cleanup cancela el rAF; los event
  // listeners de mouse/resize los limpian sus propios hooks.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new PixelCanvasRenderer(canvas, {
      cellSize,
      gap,
      color,
      cellColor,
      baseOpacity,
      behaviors: activeBehaviors,
    })
    rendererRef.current = renderer

    const container = containerRef.current
    if (container) {
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    renderer.start()

    return () => {
      renderer.destroy()
      rendererRef.current = null
    }
  }, [cellSize, gap, color, cellColor, baseOpacity, activeBehaviors])

  useEffect(() => {
    if (size.width > 0 && size.height > 0) {
      rendererRef.current?.setSize(size.width, size.height)
    }
  }, [size.width, size.height])

  useEffect(() => {
    rendererRef.current?.setMouse(mouse)
  }, [mouse])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', ...style }}
      {...rest}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}
