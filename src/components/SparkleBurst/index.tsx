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
import { spawnSparkles, sparkleScale, starGeometry, stepSparkles, type Sparkle } from './physics'
import type {
  SparkleBurstHandle,
  SparkleBurstProps,
  SparkleFireOptions,
  SparkleOrigin,
} from './types'

export type {
  SparkleBurstHandle,
  SparkleBurstProps,
  SparkleFireOptions,
  SparkleOrigin,
} from './types'

const CSS = `
.aui-sparkle-burst {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-sparkle-burst > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

/** Dorados y blanco; cada color se materializa como `--aui-sparkle-color-<i>`. */
const DEFAULT_COLORS = ['#fde047', '#facc15', '#fef9c3', '#ffffff']
const DEFAULT_ORIGIN: SparkleOrigin = { x: 0.5, y: 0.5 }

/** Frames por segundo asumidos para convertir `duration` a vida en frames. */
const FRAMES_PER_SECOND = 60

/** Defaults compartidos entre el componente y el merge por disparo. */
const DEFAULTS = {
  count: 8,
  spread: 60,
  size: 12,
  duration: 0.9,
}

/**
 * Destellos one-shot (estrellas de 4 puntas que titilan y se apagan) sobre un
 * overlay `<canvas>` pasivo (`absolute, inset: 0`, `pointer-events: none`):
 * cada `fire(options?)` dispersa destellos de vida corta alrededor de un
 * punto, con aparición escalonada y envolvente de escala (crecen rápido y se
 * encogen). Pensado para feedback breve: like, favorito, logro chico.
 *
 * Las props son los defaults de cada disparo y las `options` las overridean
 * por ráfaga; disparos sucesivos se acumulan sobre el mismo canvas y RAF. El
 * RAF arranca con el primer `fire()` y se detiene solo cuando no quedan
 * destellos vivos — costo cero en reposo.
 *
 * Con `prefers-reduced-motion` (y `respectReducedMotion` activo) `fire()` es
 * un no-op (convención de la categoría celebración/feedback). `fire()` antes
 * de la hidratación o sin canvas disponible también es un no-op seguro.
 */
export const SparkleBurst = forwardRef<SparkleBurstHandle, SparkleBurstProps>(
  function SparkleBurst(
    {
      count = DEFAULTS.count,
      colors = DEFAULT_COLORS,
      origin = DEFAULT_ORIGIN,
      spread = DEFAULTS.spread,
      size = DEFAULTS.size,
      duration = DEFAULTS.duration,
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
    const defaultsRef = useRef({ count, colors, origin, spread, size, duration })

    const reducedMotion = useReducedMotion()

    const { containerRef, canvasRef, fire: engineFire } = useOneShotCanvas<Sparkle[]>(
      (ctx, _w, _h, sparkles) => {
        stepSparkles(sparkles)
        for (const s of sparkles) {
          if (s.delay > 0) continue // todavía no apareció
          const scale = sparkleScale(s.age / s.lifespan)
          if (scale <= 0) continue
          const { tips, waists } = starGeometry(s.size * scale)
          ctx.save()
          ctx.translate(s.x, s.y)
          ctx.rotate(s.rotation)
          ctx.globalAlpha = scale
          ctx.fillStyle = s.color
          ctx.beginPath()
          ctx.moveTo(tips[0].x, tips[0].y)
          for (let i = 1; i <= 4; i++) {
            const waist = waists[i - 1]
            const tip = tips[i % 4]
            ctx.quadraticCurveTo(waist.x, waist.y, tip.x, tip.y)
          }
          ctx.fill()
          ctx.restore()
        }
        return sparkles.length > 0
      },
    )

    useEffect(() => {
      injectStyles(styleId('sparkle-burst'), CSS)
    }, [])

    useEffect(() => {
      staticRef.current = respectReducedMotion && reducedMotion
    }, [respectReducedMotion, reducedMotion])

    useEffect(() => {
      defaultsRef.current = { count, colors, origin, spread, size, duration }
    })

    const fire = useCallback(
      (options?: SparkleFireOptions) => {
        // No-op bajo reduced motion; pre-hidratación/sin canvas lo resuelve
        // el engine compartido.
        if (staticRef.current) return
        const container = containerRef.current
        if (!container) return
        engineFire((width, height) => {
          const d = defaultsRef.current
          const burstColors = options?.colors ?? d.colors
          // Colores efectivos: un override CSS (`--aui-sparkle-color-<i>`)
          // prevalece sobre el default de la prop (no sobre options explícitas).
          const computed = getComputedStyle(container)
          const effColors = burstColors.map((c, i) => {
            if (options?.colors) return c
            return computed.getPropertyValue(`--aui-sparkle-color-${i}`).trim() || c
          })

          return spawnSparkles({
            count: options?.count ?? d.count,
            width,
            height,
            origin: options?.origin ?? d.origin,
            spread: options?.spread ?? d.spread,
            size: options?.size ?? d.size,
            lifespan: Math.round((options?.duration ?? d.duration) * FRAMES_PER_SECOND),
            colors: effColors,
            rng: createPrng(`aui-sparkle-${burstRef.current++}`),
          })
        })
      },
      [engineFire, containerRef],
    )

    useImperativeHandle(ref, () => ({ fire }), [fire])

    // Los colores default se materializan como CSS vars pisables en cascada.
    const colorVars: Record<string, string> = {}
    colors.forEach((c, i) => {
      colorVars[`--aui-sparkle-color-${i}`] = c
    })

    return (
      <div
        ref={containerRef}
        className={`aui-sparkle-burst${className ? ` ${className}` : ''}`}
        style={{ ...colorVars, ...style } as CSSProperties}
        {...rest}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    )
  },
)
