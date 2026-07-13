import type { HTMLAttributes } from 'react'

/** Dock orientation: horizontal row (default) or vertical column. */
export type DockOrientation = 'horizontal' | 'vertical'

export interface DockProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum scale of the item under the cursor. Default: `1.5`. */
  magnification?: number
  /** Cursor influence radius in px (at that distance the scale returns to 1). Default: `120`. */
  radius?: number
  /** Gap between items in px. Default: `8`. Also via `--aui-dock-gap`. */
  gap?: number
  /** Orientation of the row and of the magnification axis. Default: `'horizontal'`. */
  orientation?: DockOrientation
  /** Duration of the return to base scale in seconds. Default: `0.25`. Also via `--aui-dock-return`. */
  returnDuration?: number
  /**
   * If `false`, the magnification operates even when the system has
   * `prefers-reduced-motion` enabled. Default: `true` (with reduce, static row).
   */
  respectReducedMotion?: boolean
}

export interface DockItemProps extends HTMLAttributes<HTMLDivElement> {}
