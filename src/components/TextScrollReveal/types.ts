import type { ElementType, HTMLAttributes } from 'react'

export interface TextScrollRevealProps extends HTMLAttributes<HTMLElement> {
  /** The text to light up progressively (plain text; split by word). */
  children: string
  /** Root element to render. Default: `'p'`. */
  as?: ElementType
  /** Opacity of the dimmed words. Default: `0.15`. Also via `--aui-text-scroll-from-opacity`. */
  fromOpacity?: number
  /** Opacity of the lit words. Default: `1`. Also via `--aui-text-scroll-to-opacity`. */
  toOpacity?: number
  /** Color of the dimmed words (optional; without colors the text uses `currentColor`). Also via `--aui-text-scroll-from-color`. */
  fromColor?: string
  /** Color of the lit words (optional). Also via `--aui-text-scroll-to-color`. */
  toColor?: string
  /**
   * Portion of the container's travel through the viewport in which the
   * light-up happens, as `[start, end]` normalized to [0, 1] (0 = just peeking
   * in from below, 1 = finished exiting at the top). Default: `[0.2, 0.6]`.
   */
  offset?: [number, number]
  /**
   * If `false`, the progressive light-up operates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the text
   * is shown fully lit and static).
   */
  respectReducedMotion?: boolean
}
