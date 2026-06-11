/*
 * CSS custom properties de SpotlightCard
 * (overrideables desde el CSS del consumer, e.g. `.mi-card { --aui-spotlight-radius: 500px; }`):
 *
 *   --aui-spotlight-color    default `rgba(255, 255, 255, 0.15)` — color del gradiente
 *   --aui-spotlight-radius   default `250px` — radio del spotlight
 *   --aui-spotlight-opacity  default `1`     — opacidad del overlay en hover
 *   --aui-spotlight-x / -y   runtime — posición del cursor, escritas por el handler
 */

export interface SpotlightVarsInput {
  color?: string
  radius?: number
  opacity?: number
}

/**
 * Materializa las props estéticas como CSS custom properties inline.
 * Solo setea las provistas explícitamente: los defaults viven como fallback
 * de `var()` en el CSS inyectado, así la cascada del consumer puede pisarlos.
 */
export function spotlightVars({ color, radius, opacity }: SpotlightVarsInput): Record<string, string> {
  const vars: Record<string, string> = {}
  if (color !== undefined) vars['--aui-spotlight-color'] = color
  if (radius !== undefined) vars['--aui-spotlight-radius'] = `${radius}px`
  if (opacity !== undefined) vars['--aui-spotlight-opacity'] = String(opacity)
  return vars
}
