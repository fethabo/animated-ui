import type { ElementType, HTMLAttributes } from 'react'

export interface WavyTextProps extends HTMLAttributes<HTMLElement> {
  /** The text to wave (plain text; split per character). */
  children: string
  /** Root element to render. Default: `'span'`. */
  as?: ElementType
  /** Maximum vertical offset in px. Default: `6`. Also via `--aui-wavy-amplitude`. */
  amplitude?: number
  /** Duration of one wave cycle in seconds. Default: `1.6`. Also via `--aui-wavy-speed`. */
  speed?: number
  /** Offset between consecutive characters in seconds. Default: `0.06`. Also via `--aui-wavy-stagger`. */
  stagger?: number
  /**
   * If `false`, the wave runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, static
   * text on its baseline).
   */
  respectReducedMotion?: boolean
}
