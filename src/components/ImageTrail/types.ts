import type { CSSProperties, HTMLAttributes } from 'react'

export interface ImageTrailProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * URLs of the image pool (required). They are emitted rotating in cyclic
   * order: once the array is exhausted, selection restarts from the first.
   */
  images: string[]
  /** Maximum width of each image in px. Default: `120`. Also via `--aui-image-trail-size`. */
  size?: number
  /**
   * Emission threshold: px of pointer travel between images (distance
   * throttle). Default: `80`.
   */
  emitEvery?: number
  /**
   * Lifetime of each image in ms (appears → floats → fades out → is removed
   * from the DOM). Default: `900`. Also via `--aui-image-trail-duration`.
   */
  duration?: number
  /**
   * Cap on live image nodes: once reached, emission waits for one to
   * finish. Default: `8`.
   */
  maxConcurrent?: number
  /** Extra class for each emitted `<img>` (border-radius, shadows, filters). */
  imageClassName?: string
  /** Extra inline styles for each emitted `<img>`. */
  imageStyle?: CSSProperties
  /**
   * If `false`, images are emitted even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the
   * effect is a no-op: no emission, children untouched).
   */
  respectReducedMotion?: boolean
}
