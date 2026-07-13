'use client'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { createPrng } from '../../utils/prng'
import { useOneShotCanvas } from '../shared/use-one-shot-canvas'
import { spawnEmojis, stepEmojis, type EmojiParticle } from './physics'
import type {
  EmojiBurstHandle,
  EmojiBurstProps,
  EmojiFireOptions,
  EmojiOrigin,
} from './types'

export type {
  EmojiBurstHandle,
  EmojiBurstProps,
  EmojiFireOptions,
  EmojiOrigin,
} from './types'

const CSS = `
.aui-emoji-burst {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-emoji-burst > canvas {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
`

const DEFAULT_EMOJIS = ['🎉', '✨', '❤️']
const DEFAULT_ORIGIN: EmojiOrigin = { x: 0.5, y: 0.5 }

/** Defaults compartidos entre el componente y el merge por disparo. */
const DEFAULTS = {
  count: 30,
  size: 24,
  angle: 90,
  spread: 70,
  power: 11,
  gravity: 0.25,
}

/**
 * Ráfaga de emojis one-shot sobre un overlay `<canvas>` pasivo
 * (`absolute, inset: 0`, `pointer-events: none`), con física de confetti
 * (abanico, gravedad, drag, giro 2D). Los emojis se renderizan con `fillText`
 * y la fuente de emojis de la plataforma — cero assets; el aspecto varía
 * entre sistemas operativos, y eso es lo esperado.
 *
 * Las props son los defaults de cada disparo y las `options` las overridean
 * por ráfaga; disparos sucesivos se acumulan sobre el mismo canvas y RAF. El
 * RAF arranca con el primer `fire()` y se detiene solo cuando no quedan
 * partículas vivas — costo cero en reposo.
 *
 * Con `prefers-reduced-motion` (y `respectReducedMotion` activo) `fire()` es
 * un no-op (convención de la categoría celebración/feedback). `fire()` antes
 * de la hidratación o sin canvas disponible también es un no-op seguro.
 */
export const EmojiBurst = forwardRef<EmojiBurstHandle, EmojiBurstProps>(
  function EmojiBurst(
    {
      emojis = DEFAULT_EMOJIS,
      count = DEFAULTS.count,
      size = DEFAULTS.size,
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
    const defaultsRef = useRef({ emojis, count, size, origin, angle, spread, power, gravity })

    const reducedMotion = useReducedMotion()

    const { containerRef, canvasRef, fire: engineFire } = useOneShotCanvas<{
      particles: EmojiParticle[]
      gravity: number
    }>((ctx, w, h, burst) => {
      stepEmojis(burst.particles, { width: w, height: h, gravity: burst.gravity })
      // El font del contexto se setea una vez por tamaño, no por partícula
      // (design de Wave J, decisión 4): las partículas se dibujan agrupadas
      // implícitamente — solo se re-setea cuando el tamaño cambia.
      let currentSize = -1
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const p of burst.particles) {
        const fontSize = Math.round(p.size)
        if (fontSize !== currentSize) {
          ctx.font = `${fontSize}px sans-serif`
          currentSize = fontSize
        }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life))
        ctx.fillText(p.emoji, 0, 0)
        ctx.restore()
      }
      return burst.particles.length > 0
    })

    useEffect(() => {
      injectStyles(styleId('emoji-burst'), CSS)
    }, [])

    useEffect(() => {
      staticRef.current = respectReducedMotion && reducedMotion
    }, [respectReducedMotion, reducedMotion])

    useEffect(() => {
      defaultsRef.current = { emojis, count, size, origin, angle, spread, power, gravity }
    })

    const fire = useCallback(
      (options?: EmojiFireOptions) => {
        // No-op bajo reduced motion; pre-hidratación/sin canvas lo resuelve
        // el engine compartido.
        if (staticRef.current) return
        engineFire((width, height) => {
          const d = defaultsRef.current
          const particles = spawnEmojis({
            count: options?.count ?? d.count,
            width,
            height,
            origin: options?.origin ?? d.origin,
            angle: options?.angle ?? d.angle,
            spread: options?.spread ?? d.spread,
            power: options?.power ?? d.power,
            size: options?.size ?? d.size,
            emojis: options?.emojis ?? d.emojis,
            rng: createPrng(`aui-emoji-${burstRef.current++}`),
          })
          return { particles, gravity: options?.gravity ?? d.gravity }
        })
      },
      [engineFire],
    )

    useImperativeHandle(ref, () => ({ fire }), [fire])

    return (
      <div
        ref={containerRef}
        className={`aui-emoji-burst${className ? ` ${className}` : ''}`}
        style={style}
        {...rest}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    )
  },
)
