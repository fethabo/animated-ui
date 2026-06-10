import type { AnimatedBackgroundVariant } from '../types'

/*
 * CSS custom properties de la variante `beam`
 * (overrideables desde el CSS del consumer):
 *
 *   --aui-beam-base      default `#050510`                  — color de fondo detrás de los rayos
 *   --aui-beam-color-1   default `rgba(124, 58, 237, 0.45)` — primer haz de luz
 *   --aui-beam-color-2   default `rgba(14, 165, 233, 0.35)` — segundo haz de luz
 *   --aui-beam-color-3   default `rgba(236, 72, 153, 0.30)` — tercer haz de luz
 *   --aui-beam-speed     default `16s`  — duración de una rotación completa
 *   --aui-beam-blur      default `24px` — desenfoque que suaviza los bordes de los rayos
 *   --aui-beam-opacity   default `1`    — intensidad global del efecto
 */
export const beam: AnimatedBackgroundVariant = {
  name: 'beam',
  css: `
.aui-beam {
  background-color: var(--aui-beam-base, #050510);
}
.aui-beam::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    var(--aui-beam-color-1, rgba(124, 58, 237, 0.45)) 25deg,
    transparent 55deg,
    transparent 110deg,
    var(--aui-beam-color-2, rgba(14, 165, 233, 0.35)) 140deg,
    transparent 175deg,
    transparent 240deg,
    var(--aui-beam-color-3, rgba(236, 72, 153, 0.3)) 270deg,
    transparent 305deg,
    transparent 360deg
  );
  filter: blur(var(--aui-beam-blur, 24px));
  opacity: var(--aui-beam-opacity, 1);
  animation: aui-beam-spin var(--aui-beam-speed, 16s) linear infinite;
}
@keyframes aui-beam-spin {
  to { transform: rotate(360deg); }
}
`,
  cssVars({ colors, speed, intensity }) {
    const vars: Record<string, string> = {}
    if (colors?.[0]) vars['--aui-beam-color-1'] = colors[0]
    if (colors?.[1]) vars['--aui-beam-color-2'] = colors[1]
    if (colors?.[2]) vars['--aui-beam-color-3'] = colors[2]
    if (colors?.[3]) vars['--aui-beam-base'] = colors[3]
    if (speed !== undefined) vars['--aui-beam-speed'] = `${speed}s`
    if (intensity !== undefined) vars['--aui-beam-opacity'] = String(intensity)
    return vars
  },
}
