/*
 * Esqueleto compartido del patrón one-shot imperativo (convención en
 * AGENTS.md): overlay `<canvas>` pasivo + pool de ráfagas + RAF que arranca
 * al disparar y se auto-detiene con el pool vacío — costo cero en reposo.
 * Extraído de ConfettiBurst en Wave J; lo consumen los efectos de
 * celebración/feedback (ConfettiBurst, FireworksBurst, SparkleBurst,
 * EmojiBurst, ClickSpark).
 *
 * El hook no conoce reduced motion ni el merge props/options: eso queda en
 * cada componente. Su contrato es un único callback `stepAndDraw` que avanza
 * y dibuja una ráfaga por frame y reporta si sigue viva; el spawn de cada
 * disparo entra como closure en `fire()`.
 */
import { useCallback, useEffect, useRef, type RefObject } from 'react'

export interface OneShotCanvasEngine<TBurst> {
  /** Ref para el contenedor del overlay (el que define el área del efecto). */
  containerRef: RefObject<HTMLDivElement>
  /** Ref para el `<canvas>` hijo del contenedor. */
  canvasRef: RefObject<HTMLCanvasElement>
  /**
   * Encola la ráfaga que produzca `spawn(width, height)` y arranca el RAF si
   * estaba detenido (ráfagas concurrentes comparten RAF y canvas). No-op
   * seguro si el canvas no está montado, no hay contexto 2d o el contenedor
   * no tiene área; `spawn` puede retornar `null` para abortar el disparo.
   */
  fire(spawn: (width: number, height: number) => TBurst | null): void
}

export function useOneShotCanvas<TBurst>(
  stepAndDraw: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    burst: TBurst,
  ) => boolean,
): OneShotCanvasEngine<TBurst> {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const burstsRef = useRef<TBurst[]>([])
  const rafRef = useRef<number | null>(null)
  // El loop lee siempre la última versión del callback (evita closures stale
  // sin exigirle identidad estable al componente).
  const stepRef = useRef(stepAndDraw)

  useEffect(() => {
    stepRef.current = stepAndDraw
  })

  // Detiene el RAF y vacía el pool al desmontar (StrictMode-safe: el remount
  // arranca de cero y ningún loop del mount anterior sobrevive).
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      burstsRef.current = []
    }
  }, [])

  const fire = useCallback((spawn: (width: number, height: number) => TBurst | null) => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = container.clientWidth
    const height = container.clientHeight
    if (width <= 0 || height <= 0) return

    // Ajusta el backing store al tamaño actual (con devicePixelRatio); solo
    // en `fire()` — sin observers ni trabajo en reposo.
    const dpr = window.devicePixelRatio || 1
    const bw = Math.max(1, Math.round(width * dpr))
    const bh = Math.max(1, Math.round(height * dpr))
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw
      canvas.height = bh
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const burst = spawn(width, height)
    if (burst === null) return
    burstsRef.current.push(burst)

    if (rafRef.current !== null) return // ya hay un loop corriendo: acumula y listo

    const loop = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      ctx.clearRect(0, 0, w, h)
      burstsRef.current = burstsRef.current.filter((b) => stepRef.current(ctx, w, h, b))
      if (burstsRef.current.length === 0) {
        // Pool vacío → el RAF se detiene solo (costo cero en reposo).
        rafRef.current = null
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  return { containerRef, canvasRef, fire }
}
