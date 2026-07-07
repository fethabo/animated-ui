import type { AnimatedBackgroundVariant } from '../types'

/*
 * CSS custom properties de la variante `dots`
 * (overrideables desde el CSS del consumer):
 *
 *   --aui-dots-color     default `rgba(124, 58, 237, 0.7)` — color de los puntos
 *   --aui-dots-base      default `#050510` — color de fondo
 *   --aui-dots-size      default `2px`  — radio de cada punto
 *   --aui-dots-cell      default `28px` — separación de la retícula de puntos
 *   --aui-dots-speed     default `4s`   — duración de un pulso completo
 *   --aui-dots-opacity   default `1`    — intensidad global (pico del pulso)
 */
export const dots: AnimatedBackgroundVariant = {
  name: 'dots',
  css: `
.aui-dots {
  background-color: var(--aui-dots-base, #050510);
}
.aui-dots::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle,
    var(--aui-dots-color, rgba(124, 58, 237, 0.7)) var(--aui-dots-size, 2px),
    transparent calc(var(--aui-dots-size, 2px) + 1px)
  );
  background-size: var(--aui-dots-cell, 28px) var(--aui-dots-cell, 28px);
  animation: aui-dots-pulse var(--aui-dots-speed, 4s) ease-in-out infinite;
}
@keyframes aui-dots-pulse {
  0%, 100% {
    opacity: calc(var(--aui-dots-opacity, 1) * 0.55);
    transform: scale(1);
  }
  50% {
    opacity: var(--aui-dots-opacity, 1);
    transform: scale(1.04);
  }
}
`,
  cssVars({ colors, speed, intensity }) {
    const vars: Record<string, string> = {}
    if (colors?.[0]) vars['--aui-dots-color'] = colors[0]
    if (colors?.[1]) vars['--aui-dots-base'] = colors[1]
    if (speed !== undefined) vars['--aui-dots-speed'] = `${speed}s`
    if (intensity !== undefined) vars['--aui-dots-opacity'] = String(intensity)
    return vars
  },
}
