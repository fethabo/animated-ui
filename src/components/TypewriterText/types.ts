import type { HTMLAttributes } from 'react'

export interface TypewriterTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Text to type. A string is typed once; a `string[]` with `loop` enabled
   * cycles through typing → pausing → deleting → next. It is plain text
   * (not `children`): the engine operates character by character.
   */
  text: string | string[]
  /** Characters typed per second. Default: `30`. */
  speed?: number
  /** Milliseconds before typing starts. Default: `0`. */
  startDelay?: number
  /**
   * Cursor at the end of the text. `true` uses a default glyph (`|`); a string
   * uses that character as the glyph (e.g. `"_"`, `"▋"`); `false` disables it.
   * Blinks via CSS animation (no per-frame JS). Default: `true`.
   */
  cursor?: boolean | string
  /** Characters deleted per second in loop mode. Default: `30`. */
  deleteSpeed?: number
  /** Milliseconds to pause with the full string before deleting. Default: `1500`. */
  pauseDuration?: number
  /**
   * If `true` and `text` is an array, cycles indefinitely through the
   * strings (type→pause→delete→next). Default: `false`.
   */
  loop?: boolean
  /**
   * If `false`, typing animates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, the full
   * final text is shown immediately, with no typing or cursor blink).
   */
  respectReducedMotion?: boolean
}
