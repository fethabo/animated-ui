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
import { createPrng, type Prng } from '../../utils/prng'
import { useOneShotCanvas } from '../shared/use-one-shot-canvas'
import { spawnRockets, stepFireworks, type Firework } from './physics'
import type {
  FireworksBurstHandle,
  FireworksBurstProps,
  FireworksFireOptions,
  FireworksOrigin,
} from './types'

export type {
  FireworksBurstHandle,
  FireworksBurstProps,
  FireworksFireOptions,
  FireworksOrigin,
} from './types'

const CSS = `
.aui-fireworks-burst {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-fireworks-burst > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

/** Paleta festiva default; cada color se materializa como `--aui-fireworks-color-<i>`. */
const DEFAULT_COLORS = ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa']
const DEFAULT_ORIGIN: FireworksOrigin = { x: 0.5, y: 1 }

/** Largo del trail del cohete en frames de velocidad. */
const TRAIL_SCALE = 2.5

/** Defaults compartidos entre el componente y el merge por disparo. */
const DEFAULTS = {
  rockets: 1,
  particleCount: 60,
  power: 13,
  gravity: 0.18,
}

/**
 * Fuegos artificiales one-shot sobre un overlay `<canvas>` pasivo
 * (`absolute, inset: 0`, `pointer-events: none`): cada `fire(options?)` lanza
 * cohetes desde la base que ascienden con wobble y explotan en el apex en
 * chispas radiales con gravedad y fade. Las props son los defaults de cada
 * disparo y las `options` las overridean por ráfaga; disparos sucesivos se
 * acumulan sobre el mismo canvas y RAF.
 *
 * El RAF arranca con el primer `fire()` y se detiene solo cuando no quedan
 * partículas vivas — costo cero en reposo. El efecto se recorta al contenedor
 * del componente: para cubrir el viewport, montalo dentro de un contenedor
 * `position: fixed; inset: 0`.
 *
 * Con `prefers-reduced-motion` (y `respectReducedMotion` activo) `fire()` es
 * un no-op (convención de la categoría celebración/feedback). `fire()` antes
 * de la hidratación o sin canvas disponible también es un no-op seguro.
 */
export const FireworksBurst = forwardRef<FireworksBurstHandle, FireworksBurstProps>(
  function FireworksBurst(
    {
      rockets = DEFAULTS.rockets,
      particleCount = DEFAULTS.particleCount,
      colors = DEFAULT_COLORS,
      origin = DEFAULT_ORIGIN,
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
    const defaultsRef = useRef({ rockets, particleCount, colors, origin, power, gravity })

    const reducedMotion = useReducedMotion()

    // Cada ráfaga conserva su gravedad y su rng (las explosiones consumen el
    // mismo generador del spawn: determinista de punta a punta).
    const { containerRef, canvasRef, fire: engineFire } = useOneShotCanvas<{
      pool: Firework[]
      gravity: number
      rng: Prng
    }>((ctx, w, h, burst) => {
      stepFireworks(burst.pool, { width: w, height: h, gravity: burst.gravity, rng: burst.rng })
      for (const p of burst.pool) {
        if (p.kind === 'rocket') {
          if (p.delay > 0) continue // todavía no despegó
          // Cohete: punto brillante con un trail corto contrario a la velocidad.
          ctx.strokeStyle = p.color
          ctx.globalAlpha = 0.9
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - p.vx * TRAIL_SCALE, p.y - p.vy * TRAIL_SCALE)
          ctx.stroke()
          continue
        }
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life))
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      return burst.pool.length > 0
    })

    useEffect(() => {
      injectStyles(styleId('fireworks-burst'), CSS)
    }, [])

    useEffect(() => {
      staticRef.current = respectReducedMotion && reducedMotion
    }, [respectReducedMotion, reducedMotion])

    useEffect(() => {
      defaultsRef.current = { rockets, particleCount, colors, origin, power, gravity }
    })

    const fire = useCallback(
      (options?: FireworksFireOptions) => {
        // No-op bajo reduced motion; pre-hidratación/sin canvas lo resuelve
        // el engine compartido.
        if (staticRef.current) return
        const container = containerRef.current
        if (!container) return
        engineFire((width, height) => {
          const d = defaultsRef.current
          const burstColors = options?.colors ?? d.colors
          // Colores efectivos: un override CSS (`--aui-fireworks-color-<i>`)
          // prevalece sobre el default de la prop (no sobre options explícitas).
          const computed = getComputedStyle(container)
          const effColors = burstColors.map((c, i) => {
            if (options?.colors) return c
            return computed.getPropertyValue(`--aui-fireworks-color-${i}`).trim() || c
          })

          const rng = createPrng(`aui-fireworks-${burstRef.current++}`)
          const pool = spawnRockets({
            rockets: options?.rockets ?? d.rockets,
            particleCount: options?.particleCount ?? d.particleCount,
            width,
            height,
            origin: options?.origin ?? d.origin,
            power: options?.power ?? d.power,
            colors: effColors,
            rng,
          })
          return { pool, gravity: options?.gravity ?? d.gravity, rng }
        })
      },
      [engineFire, containerRef],
    )

    useImperativeHandle(ref, () => ({ fire }), [fire])

    // Los colores default se materializan como CSS vars pisables en cascada.
    const colorVars: Record<string, string> = {}
    colors.forEach((c, i) => {
      colorVars[`--aui-fireworks-color-${i}`] = c
    })

    return (
      <div
        ref={containerRef}
        className={`aui-fireworks-burst${className ? ` ${className}` : ''}`}
        style={{ ...colorVars, ...style } as CSSProperties}
        {...rest}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    )
  },
)
