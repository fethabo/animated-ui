import type { HTMLAttributes, ReactNode } from 'react'

/** Transition preset between words. */
export type RotatingTransition = 'fade' | 'slide-up' | 'flip'

export interface RotatingTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** List of words to rotate through. */
  words: string[]
  /** Preset for the transition between words. Default: `'slide-up'`. */
  transition?: RotatingTransition
  /** Ms each word stays visible. Default: `2200`. */
  interval?: number
  /** Transition duration (entrance and width adjustment) in seconds. Default: `0.4`. Also via `--aui-rotating-duration`. */
  duration?: number
  /** Color of the rotating word. Default: inherits. Also via `--aui-rotating-color`. */
  color?: string
  /** With `false`, rotation stops at the last word. Default: `true`. */
  loop?: boolean
  /**
   * If `false`, rotation runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, shows the
   * first word statically).
   */
  respectReducedMotion?: boolean
  /** Optional base text preceding the rotating word (e.g. `We build `). */
  children?: ReactNode
}
