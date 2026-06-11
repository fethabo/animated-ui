/*
 * CSS custom properties de GlowBorder
 * (overrideables desde el CSS del consumer, e.g. `.mi-borde { --aui-glow-speed: 3s; }`):
 *
 *   --aui-glow-color-1   default `#7c3aed` (violeta) — primer color del cónico
 *   --aui-glow-color-2   default `#0ea5e9` (cyan)    — segundo color
 *   --aui-glow-color-3   default `#ec4899` (rosa)    — tercer color
 *   --aui-glow-speed     default `4s`   — duración de una rotación del loop
 *   --aui-glow-width     default `1px`  — ancho del anillo de borde
 *   --aui-glow-radius    default `12px` — border-radius exterior
 *   --aui-glow-opacity   default `1`    — intensidad del glow
 */

export interface GlowVarsInput {
  colors?: string[]
  speed?: number
  width?: number
  radius?: number
  opacity?: number
}

/**
 * Materializa las props estéticas como CSS custom properties inline.
 * Solo setea las provistas explícitamente: los defaults viven como fallback
 * de `var()` en el CSS inyectado, así la cascada del consumer puede pisarlos.
 */
export function glowVars({ colors, speed, width, radius, opacity }: GlowVarsInput): Record<string, string> {
  const vars: Record<string, string> = {}
  colors?.slice(0, 3).forEach((color, i) => {
    vars[`--aui-glow-color-${i + 1}`] = color
  })
  if (speed !== undefined) vars['--aui-glow-speed'] = `${speed}s`
  if (width !== undefined) vars['--aui-glow-width'] = `${width}px`
  if (radius !== undefined) vars['--aui-glow-radius'] = `${radius}px`
  if (opacity !== undefined) vars['--aui-glow-opacity'] = String(opacity)
  return vars
}
