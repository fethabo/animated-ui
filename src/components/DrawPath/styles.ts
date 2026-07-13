/*
 * CSS custom properties de DrawPath
 * (overrideables desde el CSS del consumer, e.g. `.mi-svg { --aui-draw-duration: 2s; }`):
 *
 *   --aui-draw-duration  default `1.2s`  — duración del dibujo de cada trazo
 *   --aui-draw-stagger   default `0.15s` — delay incremental entre trazos (orden documental)
 *   --aui-draw-delay     default `0s`    — delay previo al primer trazo
 *   --aui-draw-easing    default `cubic-bezier(0.45, 0, 0.35, 1)` — curva del dibujo
 */

/**
 * Genera el CSS de DrawPath: el root solo mapea sus vars públicas a las del
 * motor de dash compartido — la animación vive en el CSS del motor
 * (`svgStrokeCss`) y los estilos de trazo son los del SVG del consumer.
 */
export function drawPathCss(): string {
  return `
.aui-draw {
  --aui-stroke-duration: var(--aui-draw-duration, 1.2s);
  --aui-stroke-stagger: var(--aui-draw-stagger, 0.15s);
  --aui-stroke-delay: var(--aui-draw-delay, 0s);
  --aui-stroke-easing: var(--aui-draw-easing, cubic-bezier(0.45, 0, 0.35, 1));
}
`
}

export interface DrawPathVarsInput {
  duration?: number
  stagger?: number
  delay?: number
}

/**
 * Materializa las props estéticas como CSS custom properties inline.
 * Solo setea las provistas explícitamente: los defaults viven como fallback
 * de `var()` en el CSS inyectado, así la cascada del consumer puede pisarlos.
 */
export function drawPathVars({ duration, stagger, delay }: DrawPathVarsInput): Record<string, string> {
  const vars: Record<string, string> = {}
  if (duration !== undefined) vars['--aui-draw-duration'] = `${duration}s`
  if (stagger !== undefined) vars['--aui-draw-stagger'] = `${stagger}s`
  if (delay !== undefined) vars['--aui-draw-delay'] = `${delay}s`
  return vars
}
