import type { AnimatedBackgroundVariant } from '../types'

// Textura de ruido generada con SVG feTurbulence, embebida como data URI.
// Se tilea sobre un pseudo-elemento oversized y se anima su posición con
// steps() para simular grain "vivo" sin recalcular la turbulencia.
const NOISE_TEXTURE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

/*
 * CSS custom properties de la variante `noise`
 * (overrideables desde el CSS del consumer):
 *
 *   --aui-noise-base      default `#0a0a0a` — color base de fondo bajo el grain
 *   --aui-noise-opacity   default `0.12`    — opacidad del grain (intensidad)
 *   --aui-noise-speed     default `0.6s`    — velocidad del parpadeo del grain
 */
export const noise: AnimatedBackgroundVariant = {
  name: 'noise',
  css: `
.aui-noise {
  background-color: var(--aui-noise-base, #0a0a0a);
}
.aui-noise::after {
  content: '';
  position: absolute;
  inset: -100%;
  background-image: url("${NOISE_TEXTURE}");
  background-repeat: repeat;
  opacity: var(--aui-noise-opacity, 0.12);
  animation: aui-noise-shift var(--aui-noise-speed, 0.6s) steps(6) infinite;
}
@keyframes aui-noise-shift {
  0%   { transform: translate(0, 0); }
  16%  { transform: translate(-5%, 3%); }
  33%  { transform: translate(4%, -6%); }
  50%  { transform: translate(-3%, -4%); }
  66%  { transform: translate(6%, 5%); }
  83%  { transform: translate(-6%, -2%); }
  100% { transform: translate(0, 0); }
}
`,
  cssVars({ colors, speed, intensity }) {
    const vars: Record<string, string> = {}
    if (colors?.[0]) vars['--aui-noise-base'] = colors[0]
    if (speed !== undefined) vars['--aui-noise-speed'] = `${speed}s`
    if (intensity !== undefined) vars['--aui-noise-opacity'] = String(intensity)
    return vars
  },
}
