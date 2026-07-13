/*
 * CSS custom properties de TextHighlighter
 * (overrideables desde el CSS del consumer, e.g. `.mi-frase { --aui-highlighter-color: gold; }`):
 *
 *   --aui-highlighter-color         default `currentColor` — color del trazo
 *   --aui-highlighter-stroke-width  default `3` (`highlight` usa `1em`) — grosor del trazo
 *   --aui-highlighter-duration     default `0.9s` — duración del dibujo
 *   --aui-highlighter-delay        default `0s`   — delay previo al dibujo
 *   --aui-highlighter-easing       default `cubic-bezier(0.45, 0, 0.35, 1)`
 *   --aui-highlighter-opacity      default `0.45` — opacidad de la franja `highlight`
 */

/**
 * Genera el CSS de TextHighlighter: el span root (inline-block, relativo)
 * mapea sus vars públicas a las del motor de dash; el SVG overlay es absoluto,
 * sin eventos y fuera del árbol de accesibilidad. La franja `highlight` pinta
 * detrás del texto (z-index negativo) con opacidad translúcida. Con reduced
 * motion (`data-aui-static`) el SVG queda oculto hasta el disparo y aparece
 * completo, sin animación (el trazo nunca se enrolla).
 */
export function highlighterCss(): string {
  return `
.aui-highlighter {
  position: relative;
  display: inline-block;
  --aui-stroke-duration: var(--aui-highlighter-duration, 0.9s);
  --aui-stroke-delay: var(--aui-highlighter-delay, 0s);
  --aui-stroke-easing: var(--aui-highlighter-easing, cubic-bezier(0.45, 0, 0.35, 1));
}
.aui-highlighter-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
.aui-highlighter-path {
  fill: none;
  stroke: var(--aui-highlighter-color, currentColor);
  stroke-width: var(--aui-highlighter-stroke-width, 3);
  stroke-linecap: round;
  stroke-linejoin: round;
}
.aui-highlighter[data-aui-shape="highlight"] .aui-highlighter-svg {
  z-index: -1;
}
.aui-highlighter[data-aui-shape="highlight"] .aui-highlighter-path {
  stroke-width: var(--aui-highlighter-stroke-width, 1em);
  opacity: var(--aui-highlighter-opacity, 0.45);
}
.aui-highlighter[data-aui-static]:not([data-aui-drawn]) .aui-highlighter-svg {
  visibility: hidden;
}
`
}

export interface HighlighterVarsInput {
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
export function highlighterVars({
  color,
  strokeWidth,
  duration,
  delay,
}: HighlighterVarsInput): Record<string, string> {
  const vars: Record<string, string> = {}
  if (color !== undefined) vars['--aui-highlighter-color'] = color
  if (strokeWidth !== undefined) vars['--aui-highlighter-stroke-width'] = String(strokeWidth)
  if (duration !== undefined) vars['--aui-highlighter-duration'] = `${duration}s`
  if (delay !== undefined) vars['--aui-highlighter-delay'] = `${delay}s`
  return vars
}
