import type { AnimatedBackgroundVariant } from '../types'

/*
 * CSS custom properties de la variante `grid`
 * (overrideables desde el CSS del consumer):
 *
 *   --aui-grid-line      default `rgba(124, 58, 237, 0.5)`  — color de las líneas de la grilla
 *   --aui-grid-base      default `#050510`                  — color de fondo / cielo
 *   --aui-grid-glow      default `rgba(236, 72, 153, 0.35)` — glow del horizonte
 *   --aui-grid-cell      default `48px` — lado de la celda de la grilla
 *   --aui-grid-speed     default `8s`   — duración de un avance de celda completo
 *   --aui-grid-opacity   default `1`    — intensidad global del efecto
 */
export const grid: AnimatedBackgroundVariant = {
  name: 'grid',
  css: `
.aui-grid {
  background-color: var(--aui-grid-base, #050510);
}
.aui-grid::before {
  content: '';
  position: absolute;
  left: -60%;
  right: -60%;
  top: 38%;
  bottom: -80%;
  background-image:
    repeating-linear-gradient(
      90deg,
      var(--aui-grid-line, rgba(124, 58, 237, 0.5)) 0 2px,
      transparent 2px var(--aui-grid-cell, 48px)
    ),
    repeating-linear-gradient(
      0deg,
      var(--aui-grid-line, rgba(124, 58, 237, 0.5)) 0 2px,
      transparent 2px var(--aui-grid-cell, 48px)
    );
  transform: perspective(320px) rotateX(62deg);
  transform-origin: 50% 0;
  opacity: var(--aui-grid-opacity, 1);
  animation: aui-grid-move var(--aui-grid-speed, 8s) linear infinite;
}
.aui-grid::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 8%;
  height: 30%;
  background: linear-gradient(to bottom, transparent, var(--aui-grid-glow, rgba(236, 72, 153, 0.35)));
  opacity: var(--aui-grid-opacity, 1);
}
@keyframes aui-grid-move {
  to {
    background-position:
      0 var(--aui-grid-cell, 48px),
      0 var(--aui-grid-cell, 48px);
  }
}
`,
  cssVars({ colors, speed, intensity }) {
    const vars: Record<string, string> = {}
    if (colors?.[0]) vars['--aui-grid-line'] = colors[0]
    if (colors?.[1]) vars['--aui-grid-base'] = colors[1]
    if (colors?.[2]) vars['--aui-grid-glow'] = colors[2]
    if (speed !== undefined) vars['--aui-grid-speed'] = `${speed}s`
    if (intensity !== undefined) vars['--aui-grid-opacity'] = String(intensity)
    return vars
  },
}
