import type { AnimatedBackgroundVariant } from '../types'

/*
 * CSS custom properties de la variante `rays`
 * (overrideables desde el CSS del consumer):
 *
 *   --aui-rays-color-1   default `rgba(251, 191, 36, 0.4)`  — primer haz de luz
 *   --aui-rays-color-2   default `rgba(249, 115, 22, 0.28)` — segundo haz de luz
 *   --aui-rays-color-3   default `rgba(236, 72, 153, 0.22)` — tercer haz de luz
 *   --aui-rays-base      default `#050510` — color de fondo
 *   --aui-rays-speed     default `18s`  — duración de un barrido completo (ida)
 *   --aui-rays-blur      default `18px` — desenfoque que suaviza los haces
 *   --aui-rays-opacity   default `1`    — intensidad global del efecto
 */
export const rays: AnimatedBackgroundVariant = {
  name: 'rays',
  css: `
.aui-rays {
  background-color: var(--aui-rays-base, #050510);
}
.aui-rays::before {
  content: '';
  position: absolute;
  left: -50%;
  right: -50%;
  top: 0;
  bottom: -120%;
  background: conic-gradient(
    from 0deg at 50% 0%,
    transparent 140deg,
    var(--aui-rays-color-1, rgba(251, 191, 36, 0.4)) 155deg,
    transparent 172deg,
    var(--aui-rays-color-2, rgba(249, 115, 22, 0.28)) 185deg,
    transparent 200deg,
    var(--aui-rays-color-3, rgba(236, 72, 153, 0.22)) 212deg,
    transparent 228deg
  );
  transform-origin: 50% 0;
  filter: blur(var(--aui-rays-blur, 18px));
  opacity: var(--aui-rays-opacity, 1);
  animation: aui-rays-sway var(--aui-rays-speed, 18s) ease-in-out infinite alternate;
}
@keyframes aui-rays-sway {
  from { transform: rotate(-14deg); }
  to { transform: rotate(14deg); }
}
`,
  cssVars({ colors, speed, intensity }) {
    const vars: Record<string, string> = {}
    if (colors?.[0]) vars['--aui-rays-color-1'] = colors[0]
    if (colors?.[1]) vars['--aui-rays-color-2'] = colors[1]
    if (colors?.[2]) vars['--aui-rays-color-3'] = colors[2]
    if (colors?.[3]) vars['--aui-rays-base'] = colors[3]
    if (speed !== undefined) vars['--aui-rays-speed'] = `${speed}s`
    if (intensity !== undefined) vars['--aui-rays-opacity'] = String(intensity)
    return vars
  },
}
