/*
 * Registro de shapes builtin de `ScribbleDecoration`. Agregar una shape nueva
 * = crear su módulo (que cumpla `ScribbleShape`) e incluirlo acá: queda
 * disponible via la prop `shape` sin cambiar la firma del componente. Cada
 * módulo es importable por separado (tree-shakeable), patrón `aesthetics/` de
 * GuidingBranches.
 */
import { arrow } from './arrow'
import { asterisk } from './asterisk'
import { spiral } from './spiral'
import { underline } from './underline'
import { circle } from './circle'
import type { ScribbleShape } from './types'

export const scribbleShapes = {
  arrow,
  asterisk,
  spiral,
  underline,
  circle,
} satisfies Record<string, ScribbleShape>

/** Nombres de shape builtin disponibles (claves del registro). */
export type ScribbleShapeName = keyof typeof scribbleShapes

export type { ScribbleShape, ScribbleSize } from './types'
