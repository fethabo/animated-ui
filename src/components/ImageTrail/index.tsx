'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import { injectStyles, styleId } from '../../utils/inject-styles'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { createPrng, range } from '../../utils/prng'
import {
  advanceImageEmitter,
  createImageEmitterState,
  resetImageEmitter,
} from './emitter'
import type { ImageTrailProps } from './types'

export type { ImageTrailProps } from './types'

// Cada imagen es un nodo efímero (patrón RippleContainer): nace en el punto
// actual del puntero, anima con keyframes inyectados (pop + flotado leve +
// fade) y se remueve sola del DOM en `animationend` — sin estado de React por
// imagen. La capa vive con overflow hidden y pointer-events none: nunca
// intercepta clicks y queda recortada al contenedor.
const CSS = `
.aui-image-trail {
  position: relative;
}
.aui-image-trail-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aui-image-trail-img {
  position: absolute;
  width: var(--aui-image-trail-size, 120px);
  height: auto;
  animation: aui-image-trail-pop var(--aui-image-trail-duration, 900ms) ease-out forwards;
  will-change: transform, opacity;
}
@keyframes aui-image-trail-pop {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.4) rotate(var(--aui-image-trail-rotate, 0deg));
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -65%) scale(1) rotate(var(--aui-image-trail-rotate, 0deg));
  }
}
`

/** Rango de la rotación aleatoria por imagen, en grados. */
const MAX_ROTATION = 12

/**
 * Imágenes efímeras que brotan siguiendo el puntero y se desvanecen (efecto
 * agency/portfolio). El pool `images` rota secuencialmente y la emisión se
 * throttlea por distancia recorrida (`emitEvery` px) con un cap de nodos
 * vivos (`maxConcurrent`). Las URLs se precargan tras el montaje para evitar
 * jank de decode en la primera emisión. Los children quedan interactivos.
 *
 * Con `prefers-reduced-motion` el efecto es no-op (sin emisión): es
 * decoración de movimiento, no feedback funcional.
 */
export function ImageTrail({
  images,
  size = 120,
  emitEvery = 80,
  duration = 900,
  maxConcurrent = 8,
  imageClassName,
  imageStyle,
  respectReducedMotion = true,
  children,
  className,
  style,
  ...rest
}: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const disabled = respectReducedMotion && reducedMotion

  useEffect(() => {
    injectStyles(styleId('image-trail'), CSS)
  }, [])

  // Precarga fuera del render: las imágenes ya están decodificadas (o en
  // vuelo) antes de la primera emisión.
  useEffect(() => {
    if (typeof window === 'undefined') return
    for (const src of images) {
      const img = new Image()
      img.src = src
    }
  }, [images])

  useEffect(() => {
    const container = containerRef.current
    const layer = layerRef.current
    if (!container || !layer || disabled || images.length === 0) return

    const rng = createPrng('image-trail')
    const emitter = createImageEmitterState()

    const onMove = (event: PointerEvent) => {
      // Touch no tiene puntero persistente: el trail degrada a no-op.
      if (event.pointerType === 'touch') return
      const rect = container.getBoundingClientRect()
      const emission = advanceImageEmitter(emitter, event.clientX - rect.left, event.clientY - rect.top, {
        emitEvery,
        imageCount: images.length,
        liveCount: layer.childElementCount,
        maxConcurrent,
      })
      if (!emission) return

      const img = document.createElement('img')
      img.className = `aui-image-trail-img${imageClassName ? ` ${imageClassName}` : ''}`
      img.src = images[emission.index]
      img.alt = ''
      img.style.left = `${emission.x}px`
      img.style.top = `${emission.y}px`
      img.style.setProperty(
        '--aui-image-trail-rotate',
        `${range(rng, -MAX_ROTATION, MAX_ROTATION).toFixed(1)}deg`,
      )
      if (imageStyle) Object.assign(img.style, imageStyle)
      img.addEventListener('animationend', () => img.remove())
      layer.appendChild(img)
    }
    const onLeave = () => resetImageEmitter(emitter)

    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerleave', onLeave)
    return () => {
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
    }
  }, [images, emitEvery, maxConcurrent, imageClassName, imageStyle, disabled])

  return (
    <div
      ref={containerRef}
      className={`aui-image-trail${className ? ` ${className}` : ''}`}
      style={
        {
          '--aui-image-trail-size': `${size}px`,
          '--aui-image-trail-duration': `${duration}ms`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
      <div ref={layerRef} className="aui-image-trail-layer" aria-hidden="true" />
    </div>
  )
}
