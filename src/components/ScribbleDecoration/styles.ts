/*
 * CSS custom properties de ScribbleDecoration
 * (overrideables desde el CSS del consumer, e.g. `.mi-scribble { --aui-scribble-color: gold; }`):
 *
 *   --aui-scribble-color         default `currentColor` — color del trazo
 *   --aui-scribble-stroke-width  default `3`    — grosor del trazo
 *   --aui-scribble-duration     default `0.9s` — duración del dibujo
 *   --aui-scribble-delay        default `0s`   — delay previo al dibujo
 *   --aui-scribble-easing       default `cubic-bezier(0.45, 0, 0.35, 1)`
 *   --aui-scribble-width        default `8em`  — ancho default del contenedor
 *   --aui-scribble-height       default `4em`  — alto default del contenedor
 */

/**
 * Genera el CSS de ScribbleDecoration: el span root (inline-block, con tamaño
 * default pisable por CSS del consumer) mapea sus vars públicas a las del
 * motor de dash; el SVG llena el contenedor, sin eventos y fuera del árbol de
 * accesibilidad. Con reduced motion (`data-aui-static`) el garabato queda
 * oculto hasta el disparo y aparece completo y estático.
 */
export function scribbleCss(): string {
  return `
.aui-scribble {
  position: relative;
  display: inline-block;
  width: var(--aui-scribble-width, 8em);
  height: var(--aui-scribble-height, 4em);
  --aui-stroke-duration: var(--aui-scribble-duration, 0.9s);
  --aui-stroke-delay: var(--aui-scribble-delay, 0s);
  --aui-stroke-easing: var(--aui-scribble-easing, cubic-bezier(0.45, 0, 0.35, 1));
}
.aui-scribble-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
.aui-scribble-path {
  fill: none;
  stroke: var(--aui-scribble-color, currentColor);
  stroke-width: var(--aui-scribble-stroke-width, 3);
  stroke-linecap: round;
  stroke-linejoin: round;
}
.aui-scribble[data-aui-static]:not([data-aui-drawn]) .aui-scribble-svg {
  visibility: hidden;
}
`
}

export interface ScribbleVarsInput {
  color?: string
  strokeWidth?: number
  duration?: number
  delay?: number
}

/**
 * Materializa las props estéticas como CSS custom properties inline.
 * Solo setea las provistas explícitamente: los defaults viven como fallback
 * de `var()` en el CSS inyectado, así la cascada del consumer puede pisarlos.
 */
export function scribbleVars({
  color,
  strokeWidth,
  duration,
  delay,
}: ScribbleVarsInput): Record<string, string> {
  const vars: Record<string, string> = {}
  if (color !== undefined) vars['--aui-scribble-color'] = color
  if (strokeWidth !== undefined) vars['--aui-scribble-stroke-width'] = String(strokeWidth)
  if (duration !== undefined) vars['--aui-scribble-duration'] = `${duration}s`
  if (delay !== undefined) vars['--aui-scribble-delay'] = `${delay}s`
  return vars
}
