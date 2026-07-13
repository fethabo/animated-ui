import type { ElementType, HTMLAttributes } from 'react'

/** When it glitches: in an autonomous loop or only while hovered. */
export type GlitchTrigger = 'loop' | 'hover'

export interface GlitchTextProps extends HTMLAttributes<HTMLElement> {
  /**
   * The text to glitch. Plain text only: the offset layers are duplicated
   * via `content: attr(data-text)` (pseudo-elements), which does not support markup.
   */
  children: string
  /** Root element to render. Default: `'span'`. */
  as?: ElementType
  /** Activation mode. Default: `'loop'` (autonomous intermittent bursts). */
  trigger?: GlitchTrigger
  /** Colors of the two offset channels `[before, after]`. Default: red/cyan. Also via `--aui-glitch-color-1/2`. */
  colors?: [string, string] | string[]
  /** Maximum channel offset in px. Default: `3`. Also via `--aui-glitch-intensity`. */
  intensity?: number
  /** Glitch bursts per cycle (a cycle lasts ~3s). Default: `1`. */
  frequency?: number
  /** Duration of each burst in seconds. Default: `0.3`. */
  burstDuration?: number
  /**
   * If `false`, the glitch runs even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, `loop`
   * stays static; `hover` keeps a dimmed static split, without jitter).
   */
  respectReducedMotion?: boolean
}
