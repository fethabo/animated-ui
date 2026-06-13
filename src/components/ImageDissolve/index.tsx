'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { bayerThreshold } from '../../utils/bayer-matrix'
import { dissolveFrame } from './dissolve'
import type { ImageDissolveProps } from './types'

export type { ImageDissolveProps } from './types'

const CSS = `
.aui-image-dissolve {
  position: relative;
  display: inline-block;
}
.aui-image-dissolve > img {
  display: block;
  width: 100%;
  height: auto;
}
.aui-image-dissolve > canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
}
`

/**
 * Transiciona entre dos imágenes con dithering ordered (matriz Bayer 8×8):
 * al cambiar `src`, la nueva imagen se materializa píxel a píxel desde los
 * thresholds Bayer más bajos a los más altos, sobre un `<canvas>` superpuesto.
 *
 * Requiere que las imágenes sean same-origin (o sirvan headers CORS): el
 * efecto lee píxeles con `getImageData` y un canvas "tainted" lo impide. Ante
 * `SecurityError`, degrada mostrando la imagen destino sin animación.
 *
 * SSR-safe: durante el render solo emite el `<img>` con su `alt`; el canvas y
 * la animación arrancan en `useEffect`. Con `prefers-reduced-motion` el `src`
 * se swapea al instante, sin dithering.
 */
export function ImageDissolve({
  src,
  alt,
  duration = 800,
  respectReducedMotion = true,
  className,
  style,
  ...rest
}: ImageDissolveProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevSrcRef = useRef<string | undefined>(undefined)

  const reducedMotion = useReducedMotion()

  useEffect(() => {
    injectStyles(styleId('image-dissolve'), CSS)
  }, [])

  useEffect(() => {
    const prev = prevSrcRef.current
    prevSrcRef.current = src
    // Primer montaje o sin cambio real: el <img> ya muestra `src`.
    if (prev === undefined || prev === src) return
    // Reduced motion: swap instantáneo (el <img> ya tiene el nuevo src).
    if (respectReducedMotion && reducedMotion) return

    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    let cancelled = false

    const fromImg = new Image()
    const toImg = new Image()
    let loadedCount = 0

    const fail = () => {
      // Degradación silenciosa: dejamos visible el <img> con el nuevo src.
      canvas.style.opacity = '0'
    }

    const begin = () => {
      if (cancelled) return
      const width = img.clientWidth || toImg.naturalWidth
      const height = img.clientHeight || toImg.naturalHeight
      if (width === 0 || height === 0) return

      canvas.width = width
      canvas.height = height

      let fromData: ImageData
      let toData: ImageData
      try {
        ctx.drawImage(fromImg, 0, 0, width, height)
        fromData = ctx.getImageData(0, 0, width, height)
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(toImg, 0, 0, width, height)
        toData = ctx.getImageData(0, 0, width, height)
      } catch {
        // SecurityError: canvas tainted (cross-origin sin CORS).
        fail()
        return
      }

      canvas.style.opacity = '1'
      const start = performance.now()
      const loop = (now: number) => {
        if (cancelled) return
        const progress = Math.min((now - start) / Math.max(duration, 1), 1)
        const frame = dissolveFrame(fromData, toData, progress, bayerThreshold)
        const out = ctx.createImageData(frame.width, frame.height)
        out.data.set(frame.data)
        ctx.putImageData(out, 0, 0)
        if (progress < 1) {
          rafId = requestAnimationFrame(loop)
        } else {
          // El <img> de abajo ya muestra el nuevo src: ocultamos el canvas.
          canvas.style.opacity = '0'
        }
      }
      rafId = requestAnimationFrame(loop)
    }

    const onLoad = () => {
      loadedCount += 1
      if (loadedCount === 2) begin()
    }
    fromImg.onload = onLoad
    toImg.onload = onLoad
    fromImg.onerror = fail
    toImg.onerror = fail
    fromImg.src = prev
    toImg.src = src

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [src, duration, respectReducedMotion, reducedMotion])

  return (
    <div
      className={`aui-image-dissolve${className ? ` ${className}` : ''}`}
      style={style as CSSProperties}
      {...rest}
    >
      <img ref={imgRef} src={src} alt={alt} />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
