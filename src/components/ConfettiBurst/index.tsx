'use client'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { createPrng } from '../../utils/prng'
import { useOneShotCanvas } from '../shared/use-one-shot-canvas'
import { spawnFlakes, stepFlakes, type Flake } from './physics'
import type {
  ConfettiBurstHandle,
  ConfettiBurstProps,
  ConfettiOrigin,
  ConfettiShape,
  FireOptions,
} from './types'

export type {
  ConfettiBurstHandle,
  ConfettiBurstProps,
  ConfettiOrigin,
  ConfettiShape,
  FireOptions,
} from './types'

const CSS = `
.aui-confetti-burst {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-confetti-burst > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

/** Paleta festiva default; cada color se materializa como `--aui-confetti-color-<i>`. */
const DEFAULT_COLORS = ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa']
const DEFAULT_SHAPES: ConfettiShape[] = ['rect', 'circle']
const DEFAULT_ORIGIN: ConfettiOrigin = { x: 0.5, y: 0.5 }

/** Relación de aspecto del copo rectangular (lado menor / lado mayor). */
const RECT_ASPECT = 0.6

/** Defaults compartidos entre el componente y el merge por disparo. */
const DEFAULTS = {
  count: 80,
  angle: 90,
  spread: 60,
  power: 12,
  gravity: 0.25,
}

/**
 * Ráfaga de confetti one-shot sobre un overlay `<canvas>` pasivo
 * (`absolute, inset: 0`, `pointer-events: none`): no anima al montar sino
 * cuando el consumer invoca `fire(options?)` en el handle expuesto por ref
 * (`ConfettiBurstHandle`). Las props son los defaults de cada disparo y las
 * `options` las overridean por ráfaga; disparos sucesivos se acumulan sobre
 * el mismo canvas y RAF.
 *
 * El RAF arranca con el primer `fire()` y se detiene solo cuando no quedan
 * copos vivos — costo cero en reposo. El confetti se recorta al contenedor
 * del componente: para cubrir el viewport, montalo dentro de un contenedor
 * `position: fixed; inset: 0`.
 *
 * Con `prefers-reduced-motion` (y `respectReducedMotion` activo) `fire()` es
 * un no-op: el confetti es celebración autónoma sin versión estática útil; el
 * feedback alternativo corre por cuenta del consumer. `fire()` antes de la
 * hidratación o sin canvas disponible también es un no-op seguro.
 */
export const ConfettiBurst = forwardRef<ConfettiBurstHandle, ConfettiBurstProps>(
  function ConfettiBurst(
    {
      count = DEFAULTS.count,
      colors = DEFAULT_COLORS,
      shapes = DEFAULT_SHAPES,
      origin = DEFAULT_ORIGIN,
      angle = DEFAULTS.angle,
      spread = DEFAULTS.spread,
      power = DEFAULTS.power,
      gravity = DEFAULTS.gravity,
      respectReducedMotion = true,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    // Seed por disparo: contador interno → cada ráfaga varía, sin Math.random.
    const burstRef = useRef(0)
    const staticRef = useRef(false)
    // Defaults vigentes para el merge de cada disparo (evita recrear el handle
    // por cambio de props: `fire` lee siempre los últimos valores acá).
    const defaultsRef = useRef({ count, colors, shapes, origin, angle, spread, power, gravity })

    const reducedMotion = useReducedMotion()

    // Esqueleto one-shot compartido (overlay + pool + RAF auto-detenible);
    // cada ráfaga conserva su propia gravedad (las options overridean solo
    // su ráfaga). Acá solo vive la física + el dibujo del copo.
    const { containerRef, canvasRef, fire: engineFire } = useOneShotCanvas<{
      flakes: Flake[]
      gravity: number
    }>((ctx, w, h, burst) => {
      stepFlakes(burst.flakes, { width: w, height: h, gravity: burst.gravity })
      for (const f of burst.flakes) {
        ctx.save()
        ctx.translate(f.x, f.y)
        ctx.rotate(f.rotation)
        ctx.globalAlpha = Math.max(0, Math.min(1, f.life))
        ctx.fillStyle = f.color
        // Tumbling: el eje menor se escala con cos(tumble) — el rect "da
        // vueltas" sobre sí mismo y el circle se achata como una moneda.
        const sy = Math.cos(f.tumble)
        if (f.shape === 'circle') {
          ctx.beginPath()
          ctx.ellipse(0, 0, f.size / 2, Math.max(0.5, (f.size / 2) * Math.abs(sy)), 0, 0, Math.PI * 2)
          ctx.fill()
        } else {
          const minor = f.size * RECT_ASPECT * sy
          ctx.fillRect(-f.size / 2, -minor / 2, f.size, minor)
        }
        ctx.restore()
      }
      return burst.flakes.length > 0
    })

    useEffect(() => {
      injectStyles(styleId('confetti-burst'), CSS)
    }, [])

    useEffect(() => {
      staticRef.current = respectReducedMotion && reducedMotion
    }, [respectReducedMotion, reducedMotion])

    useEffect(() => {
      defaultsRef.current = { count, colors, shapes, origin, angle, spread, power, gravity }
    })

    const fire = useCallback(
      (options?: FireOptions) => {
        // No-op bajo reduced motion; pre-hidratación/sin canvas lo resuelve
        // el engine compartido.
        if (staticRef.current) return
        const container = containerRef.current
        if (!container) return
        engineFire((width, height) => {
          const d = defaultsRef.current
          const burstColors = options?.colors ?? d.colors
          // Colores efectivos: un override CSS (`--aui-confetti-color-<i>`)
          // prevalece sobre el default de la prop (no sobre options explícitas).
          const computed = getComputedStyle(container)
          const effColors = burstColors.map((c, i) => {
            if (options?.colors) return c
            return computed.getPropertyValue(`--aui-confetti-color-${i}`).trim() || c
          })

          const flakes = spawnFlakes({
            count: options?.count ?? d.count,
            width,
            height,
            origin: options?.origin ?? d.origin,
            angle: options?.angle ?? d.angle,
            spread: options?.spread ?? d.spread,
            power: options?.power ?? d.power,
            colors: effColors,
            shapes: options?.shapes ?? d.shapes,
            rng: createPrng(`aui-confetti-${burstRef.current++}`),
          })
          return { flakes, gravity: options?.gravity ?? d.gravity }
        })
      },
      [engineFire, containerRef],
    )

    useImperativeHandle(ref, () => ({ fire }), [fire])

    // Los colores default se materializan como CSS vars pisables en cascada.
    const colorVars: Record<string, string> = {}
    colors.forEach((c, i) => {
      colorVars[`--aui-confetti-color-${i}`] = c
    })

    return (
      <div
        ref={containerRef}
        className={`aui-confetti-burst${className ? ` ${className}` : ''}`}
        style={{ ...colorVars, ...style } as CSSProperties}
        {...rest}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    )
  },
)
