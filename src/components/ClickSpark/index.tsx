'use client'
import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { createPrng } from '../../utils/prng'
import { useOneShotCanvas } from '../shared/use-one-shot-canvas'
import { spawnSparks, stepSparks, type ClickSparkParticle } from './physics'
import type { ClickSparkProps } from './types'

export type { ClickSparkProps } from './types'

const CSS = `
.aui-click-spark {
  position: relative;
}
.aui-click-spark > .aui-click-spark-overlay {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-click-spark > .aui-click-spark-overlay > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

/** Dorados; cada color se materializa como `--aui-clickspark-color-<i>`. */
const DEFAULT_COLORS = ['#fbbf24', '#f59e0b', '#fde68a']

/** Frames por segundo asumidos para convertir `duration` a vida en frames. */
const FRAMES_PER_SECOND = 60

const DEFAULTS = {
  count: 8,
  size: 8,
  radius: 40,
  duration: 0.4,
}

/**
 * Chispas automáticas en cada click: la variante **declarativa** de la
 * categoría celebración/feedback — sin ref ni handle, envolvé tu contenido y
 * cada `pointerdown` dentro del contenedor emite una ráfaga breve de chispas
 * radiales en el punto del evento. Los `children` permanecen interactivos
 * (el canvas es un overlay `pointer-events: none`) y clicks rápidos generan
 * ráfagas concurrentes sobre el mismo canvas y RAF.
 *
 * El RAF arranca con el primer click y se detiene solo al no quedar chispas
 * vivas — costo cero en reposo. Con `prefers-reduced-motion` (y
 * `respectReducedMotion` activo) los clicks no emiten chispas y la
 * interactividad del contenido queda intacta.
 */
export function ClickSpark({
  colors = DEFAULT_COLORS,
  count = DEFAULTS.count,
  size = DEFAULTS.size,
  radius = DEFAULTS.radius,
  duration = DEFAULTS.duration,
  respectReducedMotion = true,
  children,
  className,
  style,
  onPointerDown,
  ...rest
}: ClickSparkProps) {
  // Seed por ráfaga: contador interno → cada click varía, sin Math.random.
  const burstRef = useRef(0)
  const staticRef = useRef(false)
  // Valores vigentes para cada click (evita re-suscribir el listener por
  // cambio de props: el handler lee siempre los últimos valores acá).
  const propsRef = useRef({ colors, count, size, radius, duration })

  const reducedMotion = useReducedMotion()

  const { containerRef, canvasRef, fire: engineFire } = useOneShotCanvas<ClickSparkParticle[]>(
    (ctx, _w, _h, sparks) => {
      stepSparks(sparks)
      ctx.lineCap = 'round'
      for (const s of sparks) {
        const alpha = Math.max(0, Math.min(1, s.life))
        // Segmento radial: se dibuja contrario a la velocidad, encogiéndose
        // con la vida (la chispa "se consume").
        const len = s.size * s.life
        const speed = Math.hypot(s.vx, s.vy) || 1
        const ux = s.vx / speed
        const uy = s.vy / speed
        ctx.globalAlpha = alpha
        ctx.strokeStyle = s.color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - ux * len, s.y - uy * len)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      return sparks.length > 0
    },
  )

  useEffect(() => {
    injectStyles(styleId('click-spark'), CSS)
  }, [])

  useEffect(() => {
    staticRef.current = respectReducedMotion && reducedMotion
  }, [respectReducedMotion, reducedMotion])

  useEffect(() => {
    propsRef.current = { colors, count, size, radius, duration }
  })

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      // El handler del consumer corre siempre; las chispas solo si hay motion.
      onPointerDown?.(event)
      if (staticRef.current) return
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const originX = event.clientX - rect.left
      const originY = event.clientY - rect.top
      engineFire(() => {
        const p = propsRef.current
        // Colores efectivos: un override CSS (`--aui-clickspark-color-<i>`)
        // prevalece sobre el default de la prop.
        const computed = getComputedStyle(container)
        const effColors = p.colors.map(
          (c, i) => computed.getPropertyValue(`--aui-clickspark-color-${i}`).trim() || c,
        )
        return spawnSparks({
          count: p.count,
          origin: { x: originX, y: originY },
          radius: p.radius,
          size: p.size,
          lifespan: Math.round(p.duration * FRAMES_PER_SECOND),
          colors: effColors,
          rng: createPrng(`aui-clickspark-${burstRef.current++}`),
        })
      })
    },
    [engineFire, containerRef, onPointerDown],
  )

  // Los colores default se materializan como CSS vars pisables en cascada.
  const colorVars: Record<string, string> = {}
  colors.forEach((c, i) => {
    colorVars[`--aui-clickspark-color-${i}`] = c
  })

  return (
    <div
      ref={containerRef}
      className={`aui-click-spark${className ? ` ${className}` : ''}`}
      style={{ ...colorVars, ...style } as CSSProperties}
      onPointerDown={handlePointerDown}
      {...rest}
    >
      {children}
      <div className="aui-click-spark-overlay" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
