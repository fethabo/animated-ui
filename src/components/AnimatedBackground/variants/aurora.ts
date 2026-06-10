import type { AnimatedBackgroundVariant } from '../types'

/*
 * CSS custom properties de la variante `aurora`
 * (overrideables desde el CSS del consumer, e.g. `.mi-bg { --aui-aurora-speed: 20s; }`):
 *
 *   --aui-aurora-color-1   default `#5b21b6` (violeta) — primer gradiente
 *   --aui-aurora-color-2   default `#0ea5e9` (cyan)    — segundo gradiente
 *   --aui-aurora-color-3   default `#10b981` (verde)   — tercer gradiente
 *   --aui-aurora-color-4   default `#ec4899` (rosa)    — cuarto gradiente
 *   --aui-aurora-speed     default `14s`  — duración de un ciclo completo
 *   --aui-aurora-blur      default `60px` — desenfoque que difumina los gradientes
 *   --aui-aurora-opacity   default `1`    — intensidad global del efecto
 */
export const aurora: AnimatedBackgroundVariant = {
  name: 'aurora',
  css: `
.aui-aurora {
  background-image:
    radial-gradient(ellipse 80% 60% at 20% 30%, var(--aui-aurora-color-1, #5b21b6) 0%, transparent 60%),
    radial-gradient(ellipse 70% 60% at 80% 20%, var(--aui-aurora-color-2, #0ea5e9) 0%, transparent 60%),
    radial-gradient(ellipse 90% 70% at 60% 80%, var(--aui-aurora-color-3, #10b981) 0%, transparent 65%),
    radial-gradient(ellipse 60% 50% at 30% 70%, var(--aui-aurora-color-4, #ec4899) 0%, transparent 60%);
  background-size: 200% 200%;
  filter: blur(var(--aui-aurora-blur, 60px)) saturate(1.3);
  transform: scale(1.25);
  opacity: var(--aui-aurora-opacity, 1);
  animation: aui-aurora-drift var(--aui-aurora-speed, 14s) ease-in-out infinite alternate;
}
@keyframes aui-aurora-drift {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 20% 100%; }
}
`,
  cssVars({ colors, speed, intensity }) {
    const vars: Record<string, string> = {}
    colors?.slice(0, 4).forEach((color, i) => {
      vars[`--aui-aurora-color-${i + 1}`] = color
    })
    if (speed !== undefined) vars['--aui-aurora-speed'] = `${speed}s`
    if (intensity !== undefined) vars['--aui-aurora-opacity'] = String(intensity)
    return vars
  },
}
