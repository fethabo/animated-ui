// image-dissolve.tsx — Transición entre imágenes con dithering ordered (Bayer 8×8).
//
// Copy-paste listo: no requiere instalar @fethabo/animated-ui, solo React.
// Al cambiar el src, la nueva imagen se materializa píxel a píxel según el
// orden de la matriz Bayer: los thresholds más bajos aparecen primero. Se
// dibuja sobre un <canvas> superpuesto con drawImage + getImageData.
//
// Requiere imágenes same-origin (o con headers CORS): getImageData sobre un
// canvas "tainted" lanza SecurityError; ante eso, degradamos al swap directo.
// Para usarlo como .jsx: renombrá el archivo y borrá las anotaciones de tipo.

import { useEffect, useRef, useState } from 'react'

const DURATION = 800

// Matriz Bayer 8×8 estándar (ordered dithering).
const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]
const bayerThreshold = (row: number, col: number) => (BAYER_8[row % 8][col % 8] + 0.5) / 64

function ImageDissolve({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevSrcRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    const prev = prevSrcRef.current
    prevSrcRef.current = src
    if (prev === undefined || prev === src) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let cancelled = false
    const fromImg = new Image()
    const toImg = new Image()
    let loaded = 0

    const begin = () => {
      if (cancelled) return
      const w = img.clientWidth || toImg.naturalWidth
      const h = img.clientHeight || toImg.naturalHeight
      if (!w || !h) return
      canvas.width = w
      canvas.height = h

      let fromData: ImageData
      let toData: ImageData
      try {
        ctx.drawImage(fromImg, 0, 0, w, h)
        fromData = ctx.getImageData(0, 0, w, h)
        ctx.clearRect(0, 0, w, h)
        ctx.drawImage(toImg, 0, 0, w, h)
        toData = ctx.getImageData(0, 0, w, h)
      } catch {
        canvas.style.opacity = '0' // cross-origin sin CORS: degradar al swap directo
        return
      }

      canvas.style.opacity = '1'
      const start = performance.now()
      const loop = (now: number) => {
        if (cancelled) return
        const progress = Math.min((now - start) / DURATION, 1)
        const out = ctx.createImageData(w, h)
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const source = bayerThreshold(y, x) <= progress ? toData.data : fromData.data
            const i = (y * w + x) * 4
            out.data[i] = source[i]
            out.data[i + 1] = source[i + 1]
            out.data[i + 2] = source[i + 2]
            out.data[i + 3] = source[i + 3]
          }
        }
        ctx.putImageData(out, 0, 0)
        if (progress < 1) raf = requestAnimationFrame(loop)
        else canvas.style.opacity = '0'
      }
      raf = requestAnimationFrame(loop)
    }

    const onLoad = () => {
      loaded++
      if (loaded === 2) begin()
    }
    const fail = () => {
      canvas.style.opacity = '0'
    }
    fromImg.onload = onLoad
    toImg.onload = onLoad
    fromImg.onerror = fail
    toImg.onerror = fail
    fromImg.src = prev
    toImg.src = src

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [src])

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img ref={imgRef} src={src} alt={alt} style={{ display: 'block', width: '100%', height: 'auto' }} />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, pointerEvents: 'none' }}
      />
    </div>
  )
}

// Reemplazá por tus propias imágenes same-origin.
const IMAGES = [
  'https://picsum.photos/id/1015/600/400',
  'https://picsum.photos/id/1025/600/400',
  'https://picsum.photos/id/1043/600/400',
]

export default function ImageDissolveDemo() {
  const [index, setIndex] = useState(0)

  return (
    <div style={{ background: '#050510', color: '#eee', minHeight: '100vh', display: 'grid', placeItems: 'center', gap: '1.5rem', fontFamily: 'system-ui' }}>
      <div style={{ width: 600, maxWidth: '90vw' }}>
        <ImageDissolve src={IMAGES[index]} alt={`Imagen ${index + 1}`} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: '1px solid #444',
              background: i === index ? '#7c3aed' : '#12121f',
              color: '#eee',
              cursor: 'pointer',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <p style={{ opacity: 0.6 }}>Clic en un número: la imagen se materializa con dithering Bayer.</p>
    </div>
  )
}
